import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Heart, Loader2, Upload, Building, User, Phone } from 'lucide-react';
import { api } from '@/db/api';
import { supabase } from '@/db/supabase';

const Signup: React.FC = () => {
  const [role, setRole] = useState<'donor' | 'ngo' | 'volunteer'>('donor');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    ngo_reg_id: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithUsername } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Format phone number with +91
    if (name === 'phone') {
      let phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      if (phoneValue.startsWith('91')) {
        phoneValue = phoneValue.slice(2);
      }
      if (phoneValue.length > 10) {
        phoneValue = phoneValue.slice(0, 10);
      }
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.name || !formData.phone) {
      toast.error('Please fill in required fields including phone number');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      // Send OTP (in real scenario, Supabase would send it)
      // For testing, we'll just move to OTP step
      toast.success('OTP sent to your phone! Use 123456 for testing');
      setStep('otp');
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fixed OTP for testing
    if (otp !== '123456') {
      toast.error('Invalid OTP. Use 123456 for testing');
      return;
    }

    setLoading(true);
    try {
      const metadata = {
        name: formData.name,
        phone: `+91${formData.phone}`,
        address: formData.address,
        role: role,
        ngo_reg_id: role === 'ngo' ? formData.ngo_reg_id : null,
      };

      const { error } = await signUpWithUsername(formData.username, formData.password, metadata);
      
      if (error) {
        toast.error(error.message || 'Signup failed');
      } else {
        toast.success(role === 'ngo' ? 'Registration submitted for approval!' : 'Account created successfully!');
        navigate('/login');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-lg shadow-2xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Heart className="h-8 w-8 text-secondary fill-secondary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            {step === 'form' ? 'Join Annadhan' : 'Verify Phone Number'}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            {step === 'form' 
              ? 'Create an account to start making an impact' 
              : `Enter the OTP sent to +91 ${formData.phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'form' ? (
            <>
              <Tabs defaultValue="donor" onValueChange={(v) => setRole(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-muted/50 p-1">
                  <TabsTrigger value="donor" className="data-[state=active]:bg-secondary data-[state=active]:text-white font-semibold">
                    <User className="mr-2 h-4 w-4" /> Donor
                  </TabsTrigger>
                  <TabsTrigger value="ngo" className="data-[state=active]:bg-secondary data-[state=active]:text-white font-semibold">
                    <Building className="mr-2 h-4 w-4" /> NGO
                  </TabsTrigger>
                  <TabsTrigger value="volunteer" className="data-[state=active]:bg-secondary data-[state=active]:text-white font-semibold">
                    <Heart className="mr-2 h-4 w-4" /> Volunteer
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username*</Label>
                      <Input
                        id="username"
                        name="username"
                        placeholder="User_123"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password*</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-secondary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">{role === 'ngo' ? 'Organization Name*' : 'Full Name*'}</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={role === 'ngo' ? 'Annadhan Foundation' : 'John Doe'}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number*</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center px-3 bg-muted rounded-md border">
                        <span className="text-sm font-medium">+91</span>
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        className="focus:ring-secondary flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Enter 10-digit mobile number</p>
                  </div>

                  {role === 'ngo' && (
                    <div className="space-y-2">
                      <Label htmlFor="ngo_reg_id">NGO Registration ID*</Label>
                      <Input
                        id="ngo_reg_id"
                        name="ngo_reg_id"
                        placeholder="REG-123456"
                        value={formData.ngo_reg_id}
                        onChange={handleInputChange}
                        required={role === 'ngo'}
                        className="focus:ring-secondary"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="focus:ring-secondary"
                    />
                  </div>

                  {role === 'ngo' && (
                    <div className="p-4 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                      <Upload className="h-8 w-8 text-secondary" />
                      <span className="text-sm font-medium text-muted-foreground">Upload Verification Document</span>
                      <p className="text-xs text-muted-foreground">PDF, JPG or PNG up to 5MB</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-lg font-bold shadow-lg shadow-secondary/20 transition-all duration-300 transform hover:scale-[1.02] mt-4"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send OTP'}
                  </Button>
                </form>
              </Tabs>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/20">
                  <Phone className="h-12 w-12 text-secondary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-center block">Enter OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="focus:ring-secondary text-center text-2xl tracking-widest font-bold"
                />
                <p className="text-xs text-muted-foreground text-center">
                  For testing, use OTP: <span className="font-bold text-secondary">123456</span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1 h-12"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-white h-12 text-lg font-bold shadow-lg shadow-secondary/20"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verify & Sign Up'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-muted/50">
          <div className="text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-bold hover:underline transition-all">
              Log in now
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
