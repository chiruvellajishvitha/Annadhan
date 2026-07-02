export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';
export type FoodType = 'veg' | 'non-veg';
export type DonationStatus = 'pending' | 'accepted' | 'collected' | 'distributed';

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  ngo_reg_id?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  food_type: FoodType;
  quantity: number;
  location_lat?: number;
  location_lng?: number;
  address: string;
  pickup_time: string;
  expiry_time: string;
  photo_url?: string;
  status: DonationStatus;
  accepted_by?: string;
  created_at: string;
  updated_at: string;
  donor?: Profile;
  volunteer?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Option {
  label: string;
  value: string;
  icon?: any;
  withCount?: boolean;
}
