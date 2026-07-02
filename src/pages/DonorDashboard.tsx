import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import type { Donation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Heart, MapPin, Clock, CheckCircle2, AlertCircle, Utensils, History, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const DonorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const data = await api.getDonorDonations(user!.id);
      setDonations(data);
    } catch (err) {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'accepted': return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Accepted</Badge>;
      case 'collected': return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">Collected</Badge>;
      case 'distributed': return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Distributed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalMeals = donations.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="container px-4 py-8 md:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Welcome, {profile?.name as string}!</h1>
          <p className="text-muted-foreground text-lg">Thank you for sharing food and spreading hope.</p>
        </div>
        <Link to="/donor/post">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 h-14 text-lg font-bold shadow-xl shadow-secondary/20 transition-all duration-300 transform hover:scale-[1.05]">
            <Plus className="mr-2 h-6 w-6" /> Post New Donation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="border-none shadow-xl bg-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Total Donations</CardTitle>
            <History className="h-6 w-6 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-secondary">{donations.length}</div>
            <p className="text-sm text-muted-foreground font-medium mt-1">Impactful contributions</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Meals Provided</CardTitle>
            <Utensils className="h-6 w-6 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-secondary">{totalMeals}</div>
            <p className="text-sm text-muted-foreground font-medium mt-1">People fed with your help</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Success Rate</CardTitle>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-600">
              {donations.length > 0 ? Math.round((donations.filter(d => d.status === 'distributed').length / donations.length) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-1">Donations fully distributed</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <History className="h-6 w-6 text-secondary" /> Your Donation History
      </h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        </div>
      ) : donations.length === 0 ? (
        <Card className="border-dashed border-2 py-20 bg-muted/20">
          <CardContent className="flex flex-col items-center text-center gap-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-bold">No donations yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Your donation history is empty. Start your journey by posting surplus food today!
            </p>
            <Link to="/donor/post">
              <Button variant="outline" className="border-secondary text-secondary mt-2">
                Post My First Donation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <Card key={donation.id as string} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
              {donation.photo_url ? (
                <div className="h-48 overflow-hidden">
                  <img src={donation.photo_url} alt="Food" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-primary/20 flex items-center justify-center">
                  <Utensils className="h-12 w-12 text-secondary/40" />
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={donation.food_type === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {donation.food_type === 'veg' ? 'Veg' : 'Non-Veg'}
                    </Badge>
                    <span className="font-bold text-lg">Feeds {donation.quantity}</span>
                  </div>
                  {getStatusBadge(donation.status)}
                </div>
                <CardTitle className="text-lg font-bold line-clamp-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-secondary shrink-0" /> {donation.address as string}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-secondary" />
                  <span>Posted: {format(new Date(donation.created_at), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 text-secondary" />
                  <span>Expires: {format(new Date(donation.expiry_time), 'p, PPP')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
