import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MapPin, CheckCircle, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

const Home: React.FC = () => {
  const steps = [
    {
      title: 'Post Surplus Food',
      description: 'Donors upload details of extra food with location and pickup time.',
      icon: MapPin,
    },
    {
      title: 'NGO/Volunteer Accepts',
      description: 'Verified organizations or volunteers receive alerts and accept requests.',
      icon: CheckCircle,
    },
    {
      title: 'Collected & Distributed',
      description: 'The food is collected and safely distributed to those in need.',
      icon: Heart,
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_8ff3194c-431f-483e-849c-384c4e938dcd.jpg" 
            alt="Happy community sharing food" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 px-4 md:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Share Food. <span className="text-secondary">Spread Hope.</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-foreground/80 font-medium leading-relaxed">
            Annadhan helps connect food donors with NGOs and volunteers to reduce food waste and feed the needy. 
            Join our community to make a difference today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/donor/post">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 text-lg font-semibold h-14 w-full sm:w-auto shadow-lg shadow-secondary/20">
                Donate Food
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="px-8 text-lg font-semibold h-14 w-full sm:w-auto border-secondary text-secondary hover:bg-secondary/10 bg-white/50 backdrop-blur-sm">
                Join as Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Feeding the hungry is simple. Follow these three easy steps to start your journey with Annadhan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-primary/20">
                    <step.icon className="h-10 w-10 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-12 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px]">
              <img 
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_6fe31b45-2f36-4788-b5aa-f5ee39ca32cb.jpg" 
                alt="Volunteers serving rice and curry to children at community food donation camp in India" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-secondary/10"></div>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Our Commitment to <span className="text-secondary">Food Safety</span> and Quality
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/20 mt-1">
                    <ShieldCheck className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Strict Quality Checks</h4>
                    <p className="text-muted-foreground">We ensure that all food donations are checked for quality and freshness before distribution.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/20 mt-1">
                    <Truck className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Efficient Logistics</h4>
                    <p className="text-muted-foreground">Our network of volunteers ensures fast pickup and distribution to minimize waste.</p>
                  </div>
                </div>
              </div>
              <Link to="/signup">
                <Button className="w-fit bg-secondary hover:bg-secondary/90 text-white px-8 h-12 text-lg shadow-lg shadow-secondary/20">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-secondary mb-6">
                <Heart className="h-6 w-6 fill-secondary" />
                Annadhan
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6">
                Reducing food waste and hunger by connecting donors with those who can distribute it to people in need.
              </p>
              <div className="flex gap-4">
                {/* Social icons could go here */}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link to="/" className="hover:text-secondary transition-colors">Home</Link></li>
                <li><Link to="/login" className="hover:text-secondary transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-secondary transition-colors">Join as Volunteer</Link></li>
                <li><Link to="/donor/post" className="hover:text-secondary transition-colors">Donate Food</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Contact Us</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li>Email: contact@annadhan.org</li>
                <li>Phone: +1 (234) 567-890</li>
                <li>Address: 123 Hope St, Food City</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-muted-foreground text-sm">
            <p>© 2026 Annadhan – Food Donation Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
