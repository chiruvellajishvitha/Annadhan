import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Phone, MapPin, Building, ShieldCheck, Loader2, Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await api.updateProfile(user.id, formData);
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-12 md:px-8 max-w-4xl">
      <div className="flex flex-col md:flex-row items-start gap-12">
        {/* Profile Info & Avatar */}
        <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
          <div className="relative group">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-secondary font-black text-4xl">
                {(profile?.name as string || 'U').charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold cursor-pointer">
              Change Photo
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black mb-1">{profile?.name as string}</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold uppercase tracking-wider">
                {profile?.role}
              </div>
              {profile?.is_approved && profile.role === 'ngo' && (
                <ShieldCheck className="h-5 w-5 text-green-500 fill-green-100" />
              )}
            </div>
            <p className="text-muted-foreground text-sm">{user?.email as string}</p>
          </div>
          
          <Card className="w-full border-none shadow-lg bg-muted/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Registration Date:</span>
                  <span className="text-muted-foreground">{profile?.created_at ? new Date(profile.created_at as string).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Verification Status:</span>
                  {profile?.is_approved ? (
                    <Badge className="bg-green-500 text-white border-none">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Update Form */}
        <div className="w-full md:w-2/3">
          <Card className="border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="bg-primary/20 pb-8">
              <CardTitle className="text-2xl font-black">Edit Profile</CardTitle>
              <CardDescription className="text-foreground/70">
                Keep your information up to date so we can reach you for donations.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg font-bold flex items-center gap-2">
                    <User className="h-5 w-5 text-secondary" /> Full Name / Organization Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="h-12 text-lg focus:ring-secondary border-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-lg font-bold flex items-center gap-2">
                    <Phone className="h-5 w-5 text-secondary" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="h-12 text-lg focus:ring-secondary border-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-secondary" /> Default Address
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="min-h-[120px] text-lg focus:ring-secondary border-muted"
                  />
                </div>

                {profile?.role === 'ngo' && (
                  <div className="space-y-2">
                    <Label htmlFor="ngo_reg_id" className="text-lg font-bold flex items-center gap-2">
                      <Building className="h-5 w-5 text-secondary" /> NGO Registration ID
                    </Label>
                    <Input
                      id="ngo_reg_id"
                      value={(profile?.ngo_reg_id as string) || ''}
                      disabled
                      className="h-12 text-lg bg-muted opacity-80"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Registration ID cannot be changed once submitted.</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white h-14 text-xl font-black shadow-xl shadow-secondary/20 transition-all duration-300 transform hover:scale-[1.01]"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-6 w-6" /> Save Changes
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
