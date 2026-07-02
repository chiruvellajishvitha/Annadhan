import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import type { Donation, Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShieldCheck, Users, Utensils, AlertTriangle, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [pendingNGOs, setPendingNGOs] = useState<Profile[]>([]);
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ngos, donations] = await Promise.all([
        api.getNGOsForApproval(),
        api.getDonations()
      ]);
      setPendingNGOs(ngos);
      setAllDonations(donations);
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.approveNGO(id);
      toast.success('NGO approved successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to approve NGO');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 text-center">
        <XCircle className="h-20 w-20 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-lg">You do not have permission to view this page.</p>
        <Button className="mt-6 bg-secondary hover:bg-secondary/90 text-white" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-secondary" /> Admin Control Panel
          </h1>
          <p className="text-muted-foreground text-lg">Monitor platform activity and manage verified organizations.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 px-6 font-bold" onClick={fetchData}>Refresh Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="border-none shadow-xl bg-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Total Donations</CardTitle>
            <Utensils className="h-6 w-6 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-secondary">{allDonations.length}</div>
            <p className="text-sm text-muted-foreground font-medium mt-1">Platform-wide contributions</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Pending NGOs</CardTitle>
            <Users className="h-6 w-6 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-secondary">{pendingNGOs.length}</div>
            <p className="text-sm text-muted-foreground font-medium mt-1">Waiting for approval</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Success Ratio</CardTitle>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-600">
              {allDonations.length > 0 ? Math.round((allDonations.filter(d => d.status === 'distributed').length / allDonations.length) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-1">Overall completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-secondary" /> NGO Approval Queue
          </h2>
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
              ) : pendingNGOs.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-10 w-10 text-green-500 opacity-50" />
                  <p className="font-medium">No pending NGO approvals</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-bold">Organization</TableHead>
                      <TableHead className="font-bold">Reg ID</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingNGOs.map((ngo) => (
                      <TableRow key={ngo.id as string} className="hover:bg-muted/10">
                        <TableCell className="font-bold">{ngo.name as string}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">{ngo.ngo_reg_id as string}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            className="bg-secondary hover:bg-secondary/90 text-white font-bold"
                            onClick={() => handleApprove(ngo.id as string)}
                          >
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-secondary" /> Live Donation Feed
          </h2>
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
              ) : allDonations.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
                  <Search className="h-10 w-10 opacity-30" />
                  <p className="font-medium">No donations recorded yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-bold">Donor</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allDonations.slice(0, 10).map((donation) => (
                      <TableRow key={donation.id as string} className="hover:bg-muted/10">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{donation.donor?.name as string || "User"}</span>
                            <span className="text-xs text-muted-foreground">Feeds {donation.quantity} ({donation.food_type})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            donation.status === 'distributed' ? 'bg-green-100 text-green-700' :
                            donation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {donation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {format(new Date(donation.created_at), 'MMM d, p')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
