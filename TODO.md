# Task: Build Annadhan Food Donation Platform

## Plan
- [x] Database & Auth Setup
  - [x] Initialize Supabase `supabase_init`
  - [x] Create Database Schema (profiles, donations, notifications)
  - [x] Setup Storage Bucket for images
  - [x] Setup Auth triggers and policies
- [x] Core Infrastructure
  - [x] Define Types in `src/types/all_types.ts`
  - [x] Implement API services in `src/db/api.ts`
  - [x] Configure `AuthContext` and `RouteGuard`
  - [x] Setup Routing in `src/routes.tsx`
- [x] UI Implementation - Shared & Public
  - [x] Create Layout components (Navbar, Sidebar)
  - [x] Implement Home Page
  - [x] Implement Login/Signup Pages (Donor & NGO paths)
- [x] Donor Features
  - [x] Donor Dashboard
  - [x] Food Donation Form (with Image Upload & Location)
  - [x] Donation History
- [x] NGO/Volunteer Features
  - [x] NGO Dashboard
  - [x] Map View of Donations
  - [x] Donation Acceptance & Status Management
- [x] Admin Features
  - [x] Admin Dashboard
  - [x] NGO Approval & User Management
- [x] Refinement & Polish
  - [x] Real-time Notifications
  - [x] Theme Styling (Yellow/Orange)
  - [x] Fetch real images with `image_search`
  - [x] Final Lint & Testing

## Notes
- Primary color: Soft yellow
- Accent color: Light orange
- Roles: Donor, NGO, Volunteer, Admin
