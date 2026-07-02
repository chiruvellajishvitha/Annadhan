import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import type { Donation, Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MapPin, Clock, CheckCircle2, AlertTriangle, Utensils, Loader2, Phone, MessageSquare, Truck, PackageCheck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const NGODashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [myTasks, setMyTasks] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [available, mine] = await Promise.all([
        api.getDonations(['pending']),
        api.getAcceptedDonations(user!.id)
      ]);
      setAvailableDonations(available);
      setMyTasks(mine);
    } catch (err) {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (donationId: string) => {
    if (!profile?.is_approved && profile?.role === 'ngo') {
      toast.error('Your NGO account is pending approval by admin.');
      return;
    }
    
    try {
      await api.updateDonationStatus(donationId, 'accepted', user!.id);
      toast.success('Donation accepted! Please contact the donor.');
      fetchData();
    } catch (err) {
      toast.error('Failed to accept donation');
    }
  };

  const handleUpdateStatus = async (donationId: string, status: 'collected' | 'distributed') => {
    try {
      await api.updateDonationStatus(donationId, status);
      toast.success(`Donation marked as ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'accepted': return <Badge className="bg-blue-100 text-blue-700">Accepted</Badge>;
      case 'collected': return <Badge className="bg-purple-100 text-purple-700">Collected</Badge>;
      case 'distributed': return <Badge className="bg-green-100 text-green-700">Distributed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const MapComponent = () => (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-8 border-4 border-white">
      <iframe 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        style={{ border: 0 }} 
        referrerPolicy="no-referrer-when-downgrade" 
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0&language=en&region=cn&q=Food+Bank,New+York`} 
        allowFullScreen
      ></iframe>
    </div>
  );

  return (
    <div className="container px-4 py-8 md:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Volunteer Portal</h1>
          <p className="text-muted-foreground text-lg">Accept and manage food donations in your area.</p>
        </div>
        {!profile?.is_approved && profile?.role === 'ngo' && (
          <div className="flex items-center gap-3 bg-yellow-100 text-yellow-800 px-4 py-3 rounded-xl border border-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold text-sm">Account Pending Approval</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="available" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-muted/50 p-1 h-14 md:h-16 gap-2 border shadow-sm">
          <TabsTrigger value="available" className="flex-1 text-base md:text-lg font-bold data-[state=active]:bg-secondary data-[state=active]:text-white transition-all h-full rounded-lg">
            <MapPin className="mr-2 h-5 w-5" /> Available Donations ({availableDonations.length})
          </TabsTrigger>
          <TabsTrigger value="my-tasks" className="flex-1 text-base md:text-lg font-bold data-[state=active]:bg-secondary data-[state=active]:text-white transition-all h-full rounded-lg">
            <Truck className="mr-2 h-5 w-5" /> My Active Tasks ({myTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-8 animate-in fade-in duration-500">
          <MapComponent />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-secondary" />
              </div>
            ) : availableDonations.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <Utensils className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-xl font-bold">No food donations currently available</h3>
                <p className="text-muted-foreground mt-2">Check back later or explore other areas.</p>
              </div>
            ) : (
              availableDonations.map((donation) => (
                <Card key={donation.id as string} className="overflow-hidden border-none shadow-xl bg-white hover:scale-[1.02] transition-transform">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={donation.photo_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_fb0e5abb-dbc1-4127-984c-be2f83f6c845.jpg'} 
                      alt="Food" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={donation.food_type === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                        {donation.food_type === 'veg' ? 'Veg' : 'Non-Veg'}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-2xl text-secondary">Feeds {donation.quantity}</span>
                    </div>
                    <CardTitle className="text-lg font-bold line-clamp-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary" /> {donation.address as string}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span className="font-medium">Pick up by: {format(new Date(donation.expiry_time), 'p, PPP')}</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Donor: {donation.donor?.name as string || "Anonymous"}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12"
                      onClick={() => handleAccept(donation.id)}
                    >
                      Accept Request
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-tasks" className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-secondary" />
              </div>
            ) : myTasks.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-xl font-bold">You have no active tasks</h3>
                <p className="text-muted-foreground mt-2">Go to "Available Donations" to accept requests.</p>
              </div>
            ) : (
              myTasks.map((donation) => (
                <Card key={donation.id as string} className="overflow-hidden border-none shadow-xl bg-white">
                  <CardHeader className="bg-primary/10 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      {getStatusBadge(donation.status)}
                      <span className="text-xs text-muted-foreground">ID: {(donation.id as string).slice(0, 8)}</span>
                    </div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-secondary" /> Feeds {donation.quantity} ({donation.food_type})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Pickup Location</Label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <span className="font-semibold">{donation.address as string}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/20 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-secondary" />
                          <span className="font-bold">{donation.donor?.name as string || "Donor"}</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 rounded-full border-secondary text-secondary">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" /> Contact
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 p-2 rounded-lg">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Expiring in: {format(new Date(donation.expiry_time), 'p')}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 pt-0 pb-6">
                    {donation.status === 'accepted' && (
                      <Button 
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12"
                        onClick={() => handleUpdateStatus(donation.id, 'collected')}
                      >
                        <PackageCheck className="mr-2 h-5 w-5" /> Mark as Collected
                      </Button>
                    )}
                    {donation.status === 'collected' && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12"
                        onClick={() => handleUpdateStatus(donation.id, 'distributed')}
                      >
                        <CheckCircle className="mr-2 h-5 w-5" /> Mark as Distributed
                      </Button>
                    )}
                    {donation.status === 'distributed' && (
                      <div className="w-full p-3 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-2 font-bold">
                        <CheckCircle2 className="h-5 w-5" /> Distribution Complete
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NGODashboard;
