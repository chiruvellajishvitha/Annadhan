import { supabase } from './supabase';
import type { Profile, Donation, Notification, DonationStatus } from '@/types';

export const api = {
  // Profiles
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    // role and id cannot be updated by user (enforced by RLS)
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async getNGOsForApproval() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'ngo')
      .eq('is_approved', false);
    if (error) throw error;
    return data as Profile[];
  },

  async approveNGO(id: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', id);
    if (error) throw error;
  },

  // Donations
  async createDonation(donation: Partial<Donation>) {
    // Explicitly get the current session to ensure donor_id = auth.uid()
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to post a donation');

    const { data, error } = await supabase
      .from('donations')
      .insert({ ...donation, donor_id: user.id });
    if (error) throw error;
    return data;
  },

  async getDonations(status?: DonationStatus[]) {
    let query = supabase
      .from('donations')
      .select('*, donor:profiles!donor_id(*)')
      .order('created_at', { ascending: false });
    
    if (status && status.length > 0) {
      query = query.in('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Donation[];
  },

  async getDonationById(id: string) {
    const { data, error } = await supabase
      .from('donations')
      .select('*, donor:profiles!donor_id(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Donation | null;
  },

  async getDonorDonations(donorId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Donation[];
  },

  async getAcceptedDonations(volunteerId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select('*, donor:profiles!donor_id(*)')
      .eq('accepted_by', volunteerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Donation[];
  },

  async updateDonationStatus(id: string, status: DonationStatus, acceptedBy?: string) {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (acceptedBy) {
      updates.accepted_by = acceptedBy;
    }
    const { error } = await supabase
      .from('donations')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  // Notifications
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data as Notification[];
  },

  async markNotificationRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw error;
  },

  // Storage
  async uploadFoodImage(file: File) {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const { data, error } = await supabase.storage
      .from('annadhan_food_images')
      .upload(fileName, file);
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('annadhan_food_images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  }
};
