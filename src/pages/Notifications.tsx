import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import type { Notification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bell, Heart, CheckCircle2, AlertTriangle, Loader2, History, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications(user!.id);
      setNotifications(data);
    } catch (err) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container px-4 py-8 md:px-8 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
            <Bell className="h-8 w-8 text-secondary" /> Activity Notifications
          </h1>
          <p className="text-muted-foreground text-lg">Stay updated on your food donations and community impact.</p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-secondary" /></div>
        ) : notifications.length === 0 ? (
          <Card className="border-dashed border-2 py-20 bg-muted/20">
            <CardContent className="flex flex-col items-center text-center gap-4">
              <Bell className="h-16 w-16 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-bold">All caught up!</h3>
              <p className="text-muted-foreground max-w-sm">
                You don't have any new notifications at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card 
              key={notif.id} 
              className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] overflow-hidden ${notif.is_read ? 'bg-white opacity-80' : 'bg-primary/5 border-l-4 border-l-secondary'}`}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full mt-1 ${notif.is_read ? 'bg-muted' : 'bg-primary/30'}`}>
                    {notif.title.includes('Approved') ? (
                      <CheckCircle2 className={`h-6 w-6 ${notif.is_read ? 'text-muted-foreground' : 'text-secondary'}`} />
                    ) : notif.title.includes('Donation') ? (
                      <Heart className={`h-6 w-6 ${notif.is_read ? 'text-muted-foreground' : 'text-secondary'}`} />
                    ) : (
                      <MessageSquare className={`h-6 w-6 ${notif.is_read ? 'text-muted-foreground' : 'text-secondary'}`} />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{notif.title}</h3>
                      <span className="text-xs text-muted-foreground font-medium">{format(new Date(notif.created_at), 'p, MMM d')}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{notif.message}</p>
                    {!notif.is_read && (
                      <Badge className="bg-secondary text-white mt-2">New</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
