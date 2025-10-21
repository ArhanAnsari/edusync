'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Github, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Video,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  status: 'connected' | 'disconnected';
}

export default function TeacherIntegrationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('github');
  const [isLoading, setIsLoading] = useState(false);

  // GitHub state
  const [githubToken, setGithubToken] = useState('');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [linkedRepos, setLinkedRepos] = useState<any[]>([]);

  // Google Calendar state
  const [calendarToken, setCalendarToken] = useState('');
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  // Slack state
  const [slackToken, setSlackToken] = useState('');
  const [slackChannels, setSlackChannels] = useState<any[]>([]);
  const [slackMessage, setSlackMessage] = useState({
    channel: '',
    message: '',
  });

  // Stripe state
  const [stripeKey, setStripeKey] = useState('');
  const [stripePlans, setStripePlans] = useState([
    { name: 'Basic', price: 829, priceId: '' },
    { name: 'Premium', price: 1659, priceId: '' },
    { name: 'Enterprise', price: 4149, priceId: '' },
  ]);
  const [payments, setPayments] = useState<any[]>([]);

  // Zoom state
  const [zoomToken, setZoomToken] = useState('');
  const [zoomMeetings, setZoomMeetings] = useState<any[]>([]);
  const [newMeeting, setNewMeeting] = useState({
    topic: '',
    duration: 60,
    startTime: '',
    agenda: '',
  });

  const integrations: Integration[] = [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Link repositories and track student code submissions',
      icon: Github,
      color: 'from-gray-600 to-gray-800',
      status: githubToken ? 'connected' : 'disconnected',
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Sync assignments and deadlines to your calendar',
      icon: Calendar,
      color: 'from-blue-500 to-blue-700',
      status: calendarToken ? 'connected' : 'disconnected',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to your team',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-700',
      status: slackToken ? 'connected' : 'disconnected',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept payments for premium features and courses',
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-700',
      status: stripeKey ? 'connected' : 'disconnected',
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Create and manage virtual classroom meetings',
      icon: Video,
      color: 'from-blue-400 to-blue-600',
      status: zoomToken ? 'connected' : 'disconnected',
    },
  ];

  useEffect(() => {
    if (!loading && (!user || user.role !== 'teacher')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // GitHub Functions
  const fetchGithubRepos = async () => {
    if (!githubToken) {
      toast.error('Please enter your GitHub token');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fetch_repos',
          token: githubToken,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGithubRepos(data.repositories);
        toast.success(`Found ${data.repositories.length} repositories`);
      } else {
        toast.error(data.error || 'Failed to fetch repositories');
      }
    } catch (error) {
      toast.error('Error fetching repositories');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const linkGithubRepo = async (repo: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'link_repo',
          repoUrl: repo.url,
          repoName: repo.fullName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLinkedRepos([...linkedRepos, data.integration]);
        toast.success('Repository linked successfully');
      } else {
        toast.error(data.error || 'Failed to link repository');
      }
    } catch (error) {
      toast.error('Error linking repository');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Calendar Functions
  const createCalendarEvent = async () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      toast.error('Please fill in all event details');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/google-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_event',
          accessToken: calendarToken || undefined,
          eventTitle: newEvent.title,
          eventDescription: newEvent.description,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.manual) {
          window.open(data.calendarLink, '_blank');
          toast.success('Calendar link opened in new tab');
        } else {
          toast.success('Event created in Google Calendar');
          setCalendarEvents([...calendarEvents, data.event]);
        }
        setNewEvent({ title: '', description: '', startTime: '', endTime: '' });
      } else {
        toast.error(data.error || 'Failed to create event');
      }
    } catch (error) {
      toast.error('Error creating event');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Slack Functions
  const sendSlackMessage = async () => {
    if (!slackMessage.message) {
      toast.error('Please enter a message');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          botToken: slackToken || undefined,
          channel: slackMessage.channel || 'general',
          message: slackMessage.message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.manual ? 'Message stored for manual sending' : 'Message sent to Slack');
        setSlackMessage({ channel: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Error sending message');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlackChannels = async () => {
    if (!slackToken) {
      toast.error('Please enter your Slack bot token');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list_channels',
          botToken: slackToken,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSlackChannels(data.channels);
        toast.success(`Found ${data.channels.length} channels`);
      } else {
        toast.error(data.error || 'Failed to fetch channels');
      }
    } catch (error) {
      toast.error('Error fetching channels');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stripe Functions
  const createCheckoutSession = async (plan: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_checkout_session',
          secretKey: stripeKey || undefined,
          amount: plan.price,
          currency: 'inr',
          description: `${plan.name} Plan`,
          plan: plan.name.toLowerCase(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.manual) {
          toast.info('Payment stored. Configure Stripe for automatic checkout.');
        } else {
          window.open(data.checkoutUrl, '_blank');
          toast.success('Checkout page opened');
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

  // Zoom Functions
  const createZoomMeeting = async () => {
    if (!newMeeting.topic) {
      toast.error('Please enter a meeting topic');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/integrations/zoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_meeting',
          accessToken: zoomToken || undefined,
          topic: newMeeting.topic,
          duration: newMeeting.duration,
          startTime: newMeeting.startTime || new Date().toISOString(),
          agenda: newMeeting.agenda,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.manual) {
          toast.info('Meeting stored. Configure Zoom OAuth for automatic creation.');
        } else {
          toast.success('Meeting created successfully');
          setZoomMeetings([...zoomMeetings, data.meeting]);
        }
        setNewMeeting({ topic: '', duration: 60, startTime: '', agenda: '' });
      } else {
        toast.error(data.error || 'Failed to create meeting');
      }
    } catch (error) {
      toast.error('Error creating meeting');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchZoomMeetings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/integrations/zoom?action=list_meetings${zoomToken ? `&accessToken=${zoomToken}` : ''}`);
      const data = await response.json();
      
      if (data.success) {
        setZoomMeetings(data.meetings);
        toast.success(`Found ${data.meetings.length} meetings`);
      }
    } catch (error) {
      toast.error('Error fetching meetings');
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
          <Link href="/dashboard/teacher">
            <Button variant="ghost" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Integrations</h1>
          <p className="text-gray-400">Connect your favorite tools to enhance your teaching experience</p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {integrations.map((integration) => (
            <motion.div
              key={integration.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setActiveTab(integration.id)}
            >
              <Card className={`bg-gradient-to-br ${integration.color} border-none h-full ${activeTab === integration.id ? 'ring-2 ring-white' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <integration.icon className="w-8 h-8" />
                      <div>
                        <CardTitle className="text-white">{integration.name}</CardTitle>
                        <CardDescription className="text-gray-200 opacity-80">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'} className="mt-2">
                    {integration.status === 'connected' ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Not Connected</>
                    )}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Integration Details */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {integrations.find((i) => i.id === activeTab)?.name} Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* GitHub Tab */}
            {activeTab === 'github' && (
              <div className="space-y-6">
                <div>
                  <Label>GitHub Personal Access Token</Label>
                  <Input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxx"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="bg-gray-900 border-gray-700 mt-2"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Generate a token at{' '}
                    <a href="https://github.com/settings/tokens" target="_blank" className="text-blue-400 hover:underline">
                      GitHub Settings
                    </a>
                  </p>
                </div>

                <Button onClick={fetchGithubRepos} disabled={isLoading} className="w-full">
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Fetch Repositories
                </Button>

                {githubRepos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Your Repositories</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {githubRepos.map((repo) => (
                        <div key={repo.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                          <div>
                            <p className="font-medium">{repo.fullName}</p>
                            <p className="text-sm text-gray-400">{repo.description || 'No description'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{repo.language || 'Unknown'}</Badge>
                              <span className="text-xs text-gray-400">⭐ {repo.stars}</span>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => linkGithubRepo(repo)}>
                            <Plus className="w-4 h-4 mr-1" /> Link
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {linkedRepos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Linked Repositories</h3>
                    <div className="space-y-2">
                      {linkedRepos.map((repo) => (
                        <div key={repo.$id} className="flex items-center justify-between p-3 bg-green-900/20 rounded border border-green-800">
                          <div>
                            <p className="font-medium">{repo.repoName}</p>
                            <a href={repo.repoUrl} target="_blank" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                              View on GitHub <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <Badge variant="default" className="bg-green-600">Connected</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Google Calendar Tab */}
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <div>
                  <Label>Google Calendar Access Token (Optional)</Label>
                  <Input
                    type="password"
                    placeholder="ya29.xxxxxxxxxxxx"
                    value={calendarToken}
                    onChange={(e) => setCalendarToken(e.target.value)}
                    className="bg-gray-900 border-gray-700 mt-2"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Leave empty to generate manual calendar links
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Create New Event</h3>
                  <div>
                    <Label>Event Title</Label>
                    <Input
                      placeholder="Assignment Review Session"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="bg-gray-900 border-gray-700 mt-2"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Discuss assignment details and answer questions"
                      value={newEvent.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="bg-gray-900 border-gray-700 mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="datetime-local"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        className="bg-gray-900 border-gray-700 mt-2"
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="datetime-local"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        className="bg-gray-900 border-gray-700 mt-2"
                      />
                    </div>
                  </div>
                  <Button onClick={createCalendarEvent} disabled={isLoading} className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </div>
            )}

            {/* Slack Tab */}
            {activeTab === 'slack' && (
              <div className="space-y-6">
                <div>
                  <Label>Slack Bot Token</Label>
                  <Input
                    type="password"
                    placeholder="xoxb-xxxxxxxxxxxx"
                    value={slackToken}
                    onChange={(e) => setSlackToken(e.target.value)}
                    className="bg-gray-900 border-gray-700 mt-2"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Create a Slack app at{' '}
                    <a href="https://api.slack.com/apps" target="_blank" className="text-blue-400 hover:underline">
                      Slack API
                    </a>
                  </p>
                </div>

                <Button onClick={fetchSlackChannels} disabled={isLoading} className="w-full">
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Fetch Channels
                </Button>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Send Message</h3>
                  <div>
                    <Label>Channel</Label>
                    {slackChannels.length > 0 ? (
                      <select
                        value={slackMessage.channel}
                        onChange={(e) => setSlackMessage({ ...slackMessage, channel: e.target.value })}
                        className="w-full bg-gray-900 border-gray-700 rounded p-2 mt-2"
                      >
                        <option value="">Select a channel</option>
                        {slackChannels.map((channel) => (
                          <option key={channel.id} value={channel.id}>
                            #{channel.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="general"
                        value={slackMessage.channel}
                        onChange={(e) => setSlackMessage({ ...slackMessage, channel: e.target.value })}
                        className="bg-gray-900 border-gray-700 mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      placeholder="New assignment posted! Check your dashboard."
                      value={slackMessage.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSlackMessage({ ...slackMessage, message: e.target.value })}
                      className="bg-gray-900 border-gray-700 mt-2"
                      rows={4}
                    />
                  </div>
                  <Button onClick={sendSlackMessage} disabled={isLoading} className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            )}

            {/* Stripe Tab */}
            {activeTab === 'stripe' && (
              <div className="space-y-6">
                <div>
                  <Label>Stripe Secret Key</Label>
                  <Input
                    type="password"
                    placeholder="sk_test_xxxxxxxxxxxx"
                    value={stripeKey}
                    onChange={(e) => setStripeKey(e.target.value)}
                    className="bg-gray-900 border-gray-700 mt-2"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Get your API keys from{' '}
                    <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-blue-400 hover:underline">
                      Stripe Dashboard
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Pricing Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stripePlans.map((plan, index) => (
                      <Card key={index} className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription className="text-3xl font-bold text-white">
                            ₹{plan.price}
                            <span className="text-sm text-gray-400">/month</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            onClick={() => createCheckoutSession(plan)} 
                            disabled={isLoading}
                            className="w-full"
                            variant={index === 1 ? 'default' : 'outline'}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Subscribe
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    💡 Students can subscribe to premium features directly from their dashboard
                  </p>
                </div>
              </div>
            )}

            {/* Zoom Tab */}
            {activeTab === 'zoom' && (
              <div className="space-y-6">
                <div>
                  <Label>Zoom Access Token (Optional)</Label>
                  <Input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiJ9..."
                    value={zoomToken}
                    onChange={(e) => setZoomToken(e.target.value)}
                    className="bg-gray-900 border-gray-700 mt-2"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Create a Zoom OAuth app at{' '}
                    <a href="https://marketplace.zoom.us/" target="_blank" className="text-blue-400 hover:underline">
                      Zoom Marketplace
                    </a>
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Create New Meeting</h3>
                  <div>
                    <Label>Meeting Topic</Label>
                    <Input
                      placeholder="Weekly Office Hours"
                      value={newMeeting.topic}
                      onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })}
                      className="bg-gray-900 border-gray-700 mt-2"
                    />
                  </div>
                  <div>
                    <Label>Agenda</Label>
                    <Textarea
                      placeholder="Discuss course topics and answer questions"
                      value={newMeeting.agenda}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                      className="bg-gray-900 border-gray-700 mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newMeeting.duration}
                        onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                        className="bg-gray-900 border-gray-700 mt-2"
                      />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="datetime-local"
                        value={newMeeting.startTime}
                        onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                        className="bg-gray-900 border-gray-700 mt-2"
                      />
                    </div>
                  </div>
                  <Button onClick={createZoomMeeting} disabled={isLoading} className="w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Create Meeting
                  </Button>
                </div>

                <Button onClick={fetchZoomMeetings} disabled={isLoading} variant="outline" className="w-full">
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Fetch Meetings
                </Button>

                {zoomMeetings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Scheduled Meetings</h3>
                    <div className="space-y-2">
                      {zoomMeetings.map((meeting) => (
                        <div key={meeting.id || meeting.$id} className="p-3 bg-gray-900 rounded">
                          <p className="font-medium">{meeting.topic}</p>
                          <p className="text-sm text-gray-400">
                            {meeting.startTime ? new Date(meeting.startTime).toLocaleString() : 'Instant Meeting'}
                          </p>
                          {meeting.joinUrl && (
                            <a
                              href={meeting.joinUrl}
                              target="_blank"
                              className="text-sm text-blue-400 hover:underline flex items-center gap-1 mt-1"
                            >
                              Join Meeting <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {meeting.password && (
                            <p className="text-xs text-gray-400 mt-1">Password: {meeting.password}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
