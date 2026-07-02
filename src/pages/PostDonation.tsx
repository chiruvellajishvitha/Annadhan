import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, MapPin, Clock, Utensils, AlertTriangle } from 'lucide-react';
import { api } from '@/db/api';
import type { FoodType } from '@/types';

const PostDonation: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    food_type: 'veg' as FoodType,
    quantity: '',
    address: (profile?.address as string) || '',
    pickup_time: '',
    expiry_time: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Image size must be less than 1MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to donate');
      return;
    }

    if (!formData.quantity || !formData.address || !formData.pickup_time || !formData.expiry_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let photo_url = '';
      if (imageFile) {
        photo_url = await api.uploadFoodImage(imageFile);
      }

      await api.createDonation({
        donor_id: user.id,
        food_type: formData.food_type,
        quantity: parseInt(formData.quantity),
        address: formData.address,
        pickup_time: new Date(formData.pickup_time).toISOString(),
        expiry_time: new Date(formData.expiry_time).toISOString(),
        photo_url,
        status: 'pending',
      });

      toast.success('Food donation posted successfully!');
      navigate('/donor');
    } catch (err: any) {
      toast.error(err.message || 'Failed to post donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8 md:px-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <AlertTriangle className="h-6 w-6 rotate-180" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Post Food Donation</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/20 pb-8">
            <CardTitle className="text-xl flex items-center gap-2">
              <Utensils className="h-5 w-5 text-secondary" /> Food Details
            </CardTitle>
            <CardDescription className="text-foreground/70">
              Provide accurate information about the surplus food.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Food Type</Label>
              <RadioGroup 
                defaultValue="veg" 
                value={formData.food_type} 
                onValueChange={(v) => setFormData(p => ({ ...p, food_type: v as FoodType }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 bg-muted/30 px-4 py-3 rounded-xl border-2 border-transparent data-[state=checked]:border-secondary cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="veg" id="veg" className="text-secondary" />
                  <Label htmlFor="veg" className="cursor-pointer font-bold">Veg</Label>
                </div>
                <div className="flex items-center space-x-2 bg-muted/30 px-4 py-3 rounded-xl border-2 border-transparent data-[state=checked]:border-secondary cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="non-veg" id="non-veg" className="text-secondary" />
                  <Label htmlFor="non-veg" className="cursor-pointer font-bold">Non-Veg</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="quantity" className="text-lg font-semibold">Quantity (Feeds how many people?)*</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="e.g. 10"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="h-12 text-lg focus:ring-secondary"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold">Food Photo</Label>
              <div 
                className="relative group cursor-pointer border-2 border-dashed border-primary/30 rounded-2xl h-48 overflow-hidden bg-primary/5 hover:bg-primary/10 transition-all"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <Upload className="h-10 w-10 text-secondary" />
                    <span className="font-medium text-lg">Click to upload photo</span>
                    <span className="text-sm">Max 1MB, JPG or PNG</span>
                  </div>
                )}
                <input 
                  type="file" 
                  id="photo-upload" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl">
          <CardHeader className="bg-primary/20 pb-8">
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" /> Pickup & Location
            </CardTitle>
            <CardDescription className="text-foreground/70">
              When and where can volunteers collect the food?
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="address" className="text-lg font-semibold">Pickup Address*</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter full pickup address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="min-h-[100px] text-lg focus:ring-secondary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="pickup_time" className="text-lg font-semibold">Pickup From*</Label>
                <div className="relative">
                  <Input
                    id="pickup_time"
                    name="pickup_time"
                    type="datetime-local"
                    value={formData.pickup_time}
                    onChange={handleInputChange}
                    required
                    className="h-12 text-lg focus:ring-secondary pl-10"
                  />
                  <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="expiry_time" className="text-lg font-semibold">Food Expires At*</Label>
                <div className="relative">
                  <Input
                    id="expiry_time"
                    name="expiry_time"
                    type="datetime-local"
                    value={formData.expiry_time}
                    onChange={handleInputChange}
                    required
                    className="h-12 text-lg focus:ring-secondary pl-10"
                  />
                  <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-secondary hover:bg-secondary/90 text-white h-16 text-xl font-bold shadow-xl shadow-secondary/20 transition-all duration-300 transform hover:scale-[1.01]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" /> Posting Donation...
            </div>
          ) : (
            'Post Food Donation'
          )}
        </Button>
      </form>
    </div>
  );
};

export default PostDonation;
