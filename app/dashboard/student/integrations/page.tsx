'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Github, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Video,
  ExternalLink,
  CheckCircle,
  Clock,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';

export default function StudentIntegrationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('stripe');
  const [isLoading, setIsLoading] = useState(false);

  // Payments and subscriptions
  const [payments, setPayments] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  // Upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  // Zoom meetings
  const [zoomMeetings, setZoomMeetings] = useState<any[]>([]);

  // GitHub repos (read-only)
  const [linkedRepos, setLinkedRepos] = useState<any[]>([]);

  const pricingPlans = [
    {
      name: 'Basic',
      price: 9.99,
      features: [
        'Access to all courses',
        'Basic quiz features',
        'Assignment submissions',
        'Email support',
      ],
    },
    {
      name: 'Premium',
      price: 19.99,
      popular: true,
      features: [
        'Everything in Basic',
        'Priority support',
        'Advanced analytics',
        'Downloadable resources',
        'Certificate of completion',
      ],
    },
    {
      name: 'Enterprise',
      price: 49.99,
      features: [
        'Everything in Premium',
        '1-on-1 tutoring sessions',
        'Custom learning paths',
        'API access',
        'Dedicated account manager',
      ],
    },
  ];

  useEffect(() => {
    if (!loading && (!user || user.role !== 'student')) {
      router.push('/login');
    }

    // Check for payment status in URL
    const paymentStatus = searchParams?.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment successful! Your subscription is now active.');
      router.replace('/dashboard/student/integrations');
    } else if (paymentStatus === 'cancel') {
      toast.error('Payment cancelled. Please try again.');
      router.replace('/dashboard/student/integrations');
    }

    if (user) {
      fetchPaymentHistory();
      fetchUpcomingEvents();
      fetchZoomMeetings();
    }
  }, [user, loading, router, searchParams]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/integrations/stripe?action=payment_history');
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch('/api/integrations/google-calendar?action=synced_events');
      const data = await response.json();
      
      if (data.success) {
        setUpcomingEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchZoomMeetings = async () => {
    try {
      const response = await fetch('/api/integrations/zoom?action=list_meetings');
      const data = await response.json();
      
      if (data.success) {
        setZoomMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const createCheckoutSession = async (plan: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_checkout_session',
          amount: plan.price,
          currency: 'usd',
          description: `${plan.name} Plan`,
          plan: plan.name.toLowerCase(),
          successUrl: `${window.location.origin}/dashboard/student/integrations?payment=success`,
          cancelUrl: `${window.location.origin}/dashboard/student/integrations?payment=cancel`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          toast.info('Payment processing is being set up. Please try again later.');
        }
      } else {
        toast.error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      toast.error('Error creating checkout session');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/student">
            <Button variant="ghost" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Integrations & Subscriptions</h1>
          <p className="text-gray-400">Manage your premium features and view connected services</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-none">
            <CardContent className="p-6">
              <Calendar className="w-8 h-8 mb-2" />
              <h3 className="text-2xl font-bold">{upcomingEvents.length}</h3>
              <p className="text-sm text-gray-200">Upcoming Events</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none">
            <CardContent className="p-6">
              <Video className="w-8 h-8 mb-2" />
              <h3 className="text-2xl font-bold">{zoomMeetings.length}</h3>
              <p className="text-sm text-gray-200">Scheduled Meetings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-800 border-none">
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 mb-2" />
              <h3 className="text-2xl font-bold">{payments.filter((p) => p.status === 'completed').length}</h3>
              <p className="text-sm text-gray-200">Completed Payments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-800 border-none">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 mb-2" />
              <h3 className="text-2xl font-bold">
                ${payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
              </h3>
              <p className="text-sm text-gray-200">Total Spent</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['stripe', 'calendar', 'zoom', 'github'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === 'stripe' && <CreditCard className="w-4 h-4 mr-2" />}
              {tab === 'calendar' && <Calendar className="w-4 h-4 mr-2" />}
              {tab === 'zoom' && <Video className="w-4 h-4 mr-2" />}
              {tab === 'github' && <Github className="w-4 h-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>

        {/* Stripe/Premium Subscription Tab */}
        {activeTab === 'stripe' && (
          <div className="space-y-8">
            {/* Pricing Plans */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500">
                        Most Popular
                      </Badge>
                    )}
                    <Card className={`bg-gray-800 border-gray-700 h-full ${plan.popular ? 'ring-2 ring-yellow-500' : ''}`}>
                      <CardHeader>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription className="text-4xl font-bold text-white mt-4">
                          ${plan.price}
                          <span className="text-sm text-gray-400">/month</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          onClick={() => createCheckoutSession(plan)}
                          disabled={isLoading}
                          className="w-full"
                          variant={plan.popular ? 'default' : 'outline'}
                        >
                          {isLoading ? 'Processing...' : 'Subscribe Now'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Payment History */}
            {payments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Payment History</h2>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div
                          key={payment.$id}
                          className="flex items-center justify-between p-4 bg-gray-900 rounded"
                        >
                          <div>
                            <p className="font-medium">{payment.description || 'Premium Subscription'}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">${payment.amount}</p>
                            <Badge
                              variant={payment.status === 'completed' ? 'default' : 'secondary'}
                              className={payment.status === 'completed' ? 'bg-green-600' : ''}
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.$id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription className="mt-2">{event.description}</CardDescription>
                        </div>
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(event.startTime).toLocaleString()}</span>
                        </div>
                        {event.googleEventLink && (
                          <a
                            href={event.googleEventLink}
                            target="_blank"
                            className="text-blue-400 hover:underline text-sm flex items-center gap-1"
                          >
                            View in Calendar <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No upcoming events scheduled</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Zoom Meetings Tab */}
        {activeTab === 'zoom' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Virtual Classroom Meetings</h2>
            {zoomMeetings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zoomMeetings.map((meeting) => (
                  <Card key={meeting.$id || meeting.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{meeting.topic}</CardTitle>
                          {meeting.agenda && (
                            <CardDescription className="mt-2">{meeting.agenda}</CardDescription>
                          )}
                        </div>
                        <Video className="w-5 h-5 text-blue-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {meeting.startTime && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(meeting.startTime).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">Duration:</span>
                          <span>{meeting.duration || 60} minutes</span>
                        </div>
                        {meeting.password && (
                          <div className="p-2 bg-gray-900 rounded text-sm">
                            <span className="text-gray-400">Password:</span>{' '}
                            <span className="font-mono">{meeting.password}</span>
                          </div>
                        )}
                        {meeting.joinUrl && (
                          <a href={meeting.joinUrl} target="_blank">
                            <Button className="w-full mt-2">
                              <Video className="w-4 h-4 mr-2" />
                              Join Meeting
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No meetings scheduled</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* GitHub Tab */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Connected Repositories</h2>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <Github className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-4">
                  GitHub repositories are managed by your teachers
                </p>
                <p className="text-sm text-gray-500">
                  Check your assignments for repository links
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-none mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BookOpen className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-bold mb-1">Need Help?</h3>
                <p className="text-gray-200">
                  Contact your teacher or visit the support section for assistance with integrations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
