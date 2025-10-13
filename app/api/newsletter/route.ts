import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/email-template';
import { AdminNotificationEmail } from '@/components/admin-notification-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send confirmation email to user using React template
    const { data: userData, error: userError } = await resend.emails.send({
      from: 'EduSync <info@resend.dev>',
      to: [email],
      subject: 'Welcome to EduSync Newsletter! 🎓',
      react: WelcomeEmail({ userEmail: email }),
    });

    if (userError) {
      console.error('User email error:', userError);
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 400 }
      );
    }

    // Send notification to admin using React template
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'EduSync <admin@resend.dev>',
      to: ['arhanansari2009@gmail.com'],
      subject: '🔔 New Newsletter Subscription',
      react: AdminNotificationEmail({ 
        subscriberEmail: email, 
        subscribedAt: new Date().toLocaleString() 
      }),
    });

    if (adminError) {
      console.error('Admin email error:', adminError);
      // Don't fail the request if admin notification fails
    }

    console.log('Newsletter subscription successful:', { userData, adminData });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      id: userData?.id,
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
}
