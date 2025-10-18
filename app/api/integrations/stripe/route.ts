import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account, databases, config } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const STRIPE_API_URL = 'https://api.stripe.com/v1';

// Stripe payment integration endpoint
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const body = await request.json();
    const { 
      action, 
      secretKey, 
      amount, 
      currency, 
      description, 
      plan, 
      priceId,
      successUrl,
      cancelUrl,
      mode,
    } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    switch (action) {
      case 'create_checkout_session': {
        if (!amount || amount <= 0) {
          return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
        }

        if (!secretKey) {
          // Store payment intent in database for manual processing
          const paymentIntent = await databases.createDocument(
            config.databaseId,
            config.collections.payments || 'payments',
            ID.unique(),
            {
              userId: user.$id,
              amount,
              currency: currency || 'usd',
              description: description || 'EduSync Payment',
              plan: plan || 'basic',
              status: 'pending',
              createdAt: new Date().toISOString(),
            }
          );

          return NextResponse.json({
            success: true,
            manual: true,
            payment: paymentIntent,
            message: 'Payment intent stored. Configure Stripe API keys for automatic checkout.',
          }, { status: 201 });
        }

        // Create Stripe Checkout Session
        const sessionData = new URLSearchParams({
          'payment_method_types[]': 'card',
          'mode': mode || 'payment',
          'customer_email': user.email,
          'success_url': successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student?payment=success`,
          'cancel_url': cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student?payment=cancel`,
          'metadata[userId]': user.$id,
          'metadata[plan]': plan || 'basic',
        });

        if (mode === 'subscription' && priceId) {
          sessionData.append('line_items[0][price]', priceId);
          sessionData.append('line_items[0][quantity]', '1');
        } else {
          sessionData.append('line_items[0][price_data][currency]', currency || 'usd');
          sessionData.append('line_items[0][price_data][product_data][name]', description || 'EduSync Premium');
          sessionData.append('line_items[0][price_data][unit_amount]', (amount * 100).toString());
          sessionData.append('line_items[0][quantity]', '1');
        }

        const response = await fetch(`${STRIPE_API_URL}/checkout/sessions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: sessionData.toString(),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create checkout session');
        }

        const session = await response.json();

        // Store session in database
        const payment = await databases.createDocument(
          config.databaseId,
          config.collections.payments || 'payments',
          ID.unique(),
          {
            userId: user.$id,
            sessionId: session.id,
            amount,
            currency: currency || 'usd',
            description,
            plan: plan || 'basic',
            status: 'pending',
            checkoutUrl: session.url,
            createdAt: new Date().toISOString(),
          }
        );

        return NextResponse.json({
          success: true,
          sessionId: session.id,
          checkoutUrl: session.url,
          payment,
          message: 'Checkout session created successfully',
        }, { status: 201 });
      }

      case 'create_subscription': {
        if (!priceId) {
          return NextResponse.json({ error: 'Price ID is required for subscriptions' }, { status: 400 });
        }

        return POST(new Request(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify({
            action: 'create_checkout_session',
            secretKey,
            amount,
            currency,
            description,
            plan,
            priceId,
            successUrl,
            cancelUrl,
            mode: 'subscription',
          }),
        }));
      }

      case 'create_payment_intent': {
        if (!secretKey) {
          return NextResponse.json({ error: 'Stripe secret key is required' }, { status: 400 });
        }

        if (!amount || amount <= 0) {
          return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
        }

        const paymentData = new URLSearchParams({
          amount: (amount * 100).toString(),
          currency: currency || 'usd',
          'metadata[userId]': user.$id,
          'metadata[description]': description || 'EduSync Payment',
        });

        const response = await fetch(`${STRIPE_API_URL}/payment_intents`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: paymentData.toString(),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create payment intent');
        }

        const paymentIntent = await response.json();

        return NextResponse.json({
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        });
      }

      case 'verify_payment': {
        if (!secretKey) {
          return NextResponse.json({ error: 'Stripe secret key is required' }, { status: 400 });
        }

        const { sessionId } = body;
        if (!sessionId) {
          return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        const response = await fetch(`${STRIPE_API_URL}/checkout/sessions/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${secretKey}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const session = await response.json();

        // Update payment status in database
        const payments = await databases.listDocuments(
          config.databaseId,
          config.collections.payments || 'payments',
          [Query.equal('sessionId', sessionId)]
        );

        if (payments.documents.length > 0) {
          await databases.updateDocument(
            config.databaseId,
            config.collections.payments || 'payments',
            payments.documents[0].$id,
            {
              status: session.payment_status,
              paidAt: session.payment_status === 'paid' ? new Date().toISOString() : null,
            }
          );
        }

        return NextResponse.json({
          success: true,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total / 100,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'payment_history') {
      // Fetch user's payment history
      const payments = await databases.listDocuments(
        config.databaseId,
        config.collections.payments || 'payments',
        [Query.equal('userId', user.$id)]
      );

      return NextResponse.json({
        success: true,
        payments: payments.documents,
      });
    }

    if (action === 'subscription_status') {
      const secretKey = searchParams.get('secretKey');
      
      if (!secretKey) {
        return NextResponse.json({ 
          success: true,
          status: 'not_configured',
          message: 'Configure Stripe API keys to check subscription status' 
        });
      }

      // Fetch customer subscriptions
      const response = await fetch(`${STRIPE_API_URL}/customers?email=${user.email}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }

      const customers = await response.json();
      
      if (customers.data.length === 0) {
        return NextResponse.json({
          success: true,
          status: 'no_subscription',
          message: 'No active subscription found',
        });
      }

      const customerId = customers.data[0].id;
      
      const subsResponse = await fetch(`${STRIPE_API_URL}/subscriptions?customer=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      const subscriptions = await subsResponse.json();

      return NextResponse.json({
        success: true,
        subscriptions: subscriptions.data.map((sub: any) => ({
          id: sub.id,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          plan: sub.items.data[0]?.price?.nickname || 'Premium',
        })),
      });
    }

    return NextResponse.json({
      success: true,
      status: 'ready',
      message: 'Stripe integration ready. Use POST with actions: create_checkout_session, create_subscription, create_payment_intent, verify_payment',
    });
  } catch (error: any) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

// Webhook handler for Stripe events
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Handle different webhook events
    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object;
        
        // Update payment status
        const payments = await databases.listDocuments(
          config.databaseId,
          config.collections.payments || 'payments',
          [Query.equal('sessionId', session.id)]
        );

        if (payments.documents.length > 0) {
          await databases.updateDocument(
            config.databaseId,
            config.collections.payments || 'payments',
            payments.documents[0].$id,
            {
              status: 'completed',
              paidAt: new Date().toISOString(),
            }
          );
        }
        break;
      }

      case 'payment_intent.succeeded': {
        // Handle successful payment
        console.log('Payment succeeded:', data.object.id);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        // Handle subscription updates
        console.log('Subscription updated:', data.object.id);
        break;
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Stripe Webhook Error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      message: error.message 
    }, { status: 500 });
  }
}
