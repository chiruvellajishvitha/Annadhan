-- Create custom types
CREATE TYPE public.user_role AS ENUM ('donor', 'ngo', 'volunteer', 'admin');
CREATE TYPE public.food_type AS ENUM ('veg', 'non-veg');
CREATE TYPE public.donation_status AS ENUM ('pending', 'accepted', 'collected', 'distributed');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  address text,
  role public.user_role DEFAULT 'donor' NOT NULL,
  ngo_reg_id text, -- Only for NGO
  is_approved boolean DEFAULT false, -- For NGOs
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create is_admin helper
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'::public.user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Allow public select for shared info" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Create donations table
CREATE TABLE public.donations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id uuid REFERENCES public.profiles(id) NOT NULL,
  food_type public.food_type NOT NULL,
  quantity integer NOT NULL, -- Number of people it can feed
  location_lat double precision,
  location_lng double precision,
  address text NOT NULL,
  pickup_time timestamp with time zone NOT NULL,
  expiry_time timestamp with time zone NOT NULL,
  photo_url text,
  status public.donation_status DEFAULT 'pending' NOT NULL,
  accepted_by uuid REFERENCES public.profiles(id), -- NGO or Volunteer
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS for donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Donations policies
CREATE POLICY "Anyone authenticated can view donations" ON public.donations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Donors can create donations" ON public.donations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = donor_id AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'donor');

CREATE POLICY "Donors can update their own donations" ON public.donations
  FOR UPDATE TO authenticated USING (auth.uid() = donor_id) WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "NGOs/Volunteers can update donation status" ON public.donations
  FOR UPDATE TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('ngo', 'volunteer', 'admin')
  );

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for food photos
INSERT INTO storage.buckets (id, name, public) VALUES ('annadhan_food_images', 'annadhan_food_images', true);

-- Storage policies
CREATE POLICY "Anyone can view food images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'annadhan_food_images');

CREATE POLICY "Authenticated users can upload food images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'annadhan_food_images');

-- Handle new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  user_role public.user_role;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Logic: First user is admin, others default to donor (can be updated during signup)
  IF user_count = 0 THEN
    user_role := 'admin'::public.user_role;
  ELSE
    user_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'donor'::public.user_role);
  END IF;

  INSERT INTO public.profiles (id, email, name, phone, address, role, ngo_reg_id, is_approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.phone,
    NEW.raw_user_meta_data->>'address',
    user_role,
    NEW.raw_user_meta_data->>'ngo_reg_id',
    CASE WHEN user_role = 'ngo' THEN false ELSE true END -- NGOs need approval
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
