import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import routes from './routes';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import Navbar from '@/components/layouts/Navbar';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

const RealTimeHandler: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          toast.info(payload.new.title, {
            description: payload.new.message,
            icon: <Bell className="h-4 w-4 text-secondary" />
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RealTimeHandler />
        <RouteGuard>
          <IntersectObserver />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
