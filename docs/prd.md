# Annadhan – Food Donation Platform Requirements Document

## 1. Application Overview

### 1.1 Application Name
Annadhan – Food Donation Platform

### 1.2 Application Description
Annadhan is a modern and responsive web platform that connects people who have surplus food with NGOs and volunteers who can distribute it to needy people. The platform aims to reduce food waste and help feed hungry people by creating a bridge between food donors and organizations.

### 1.3 Design Theme
- Primary color: 95% soft yellow
- Accent color: 5% light orange for highlights and buttons
- Design style: Clean, modern, mobile-responsive layout with large action buttons
- Overall feeling: Friendly, hopeful, and community-driven

## 2. User Roles

The platform supports three types of users:

1. **Donor**: People who have extra food (restaurants, weddings, homes)
2. **NGO / Volunteer**: Organizations or volunteers who collect food and distribute it
3. **Admin**: Admin who monitors donations and manages the platform

## 3. Main Pages and Features

### 3.1 Home Page

**Hero Section**
- Title: Share Food. Spread Hope.
- Description: Annadhan helps connect food donors with NGOs and volunteers to reduce food waste and feed the needy.
- Two main buttons:
  - Donate Food
  - Join as Volunteer

**Statistics Section**
- Meals donated
- Active donors
- NGOs connected

**How it Works Section**
Display 3 steps:
1. Post surplus food
2. NGO/volunteer accepts request
3. Food is collected and distributed

**Our Commitment to Food Safety and Quality Section**
- Display a realistic photo of volunteers serving rice and curry to poor children at a community food donation camp in India
- Photo details: stainless steel plates, volunteers wearing white caps and NGO t-shirts, outdoor setting, natural sunlight, documentary photography style, humanitarian atmosphere, high resolution, realistic faces

**Footer**
- Contact details
- Social links

### 3.2 Authentication System

**Login Page**
- Users must log in before donating food
- Login fields:
  - Email or phone number
  - Password
- Login button
- Links to signup pages for donors and NGOs/volunteers

**Donor Signup**
- Name
- Phone number with +91 country code (OTP verification using fixed OTP: 123456)
- Email
- Password
- Address

**NGO / Volunteer Signup**
- Organization name
- NGO registration ID
- Phone number with +91 country code (OTP verification using fixed OTP: 123456)
- Email
- Address
- Upload verification document

### 3.3 Donor Dashboard

**Post Food Donation Form**
- Food type (veg / non-veg)
- Quantity (number of people it can feed)
- Location (Google Maps location or address)
- Pickup time
- Expiry time
- Upload food photo

**Functionality**
- After posting, nearby NGOs/volunteers should receive a notification

### 3.4 NGO / Volunteer Dashboard

**Features**
- View nearby food donations
- Accept pickup requests
- Contact donor
- Mark donation as collected
- Mark donation as distributed

### 3.5 Map Integration
- Display a map showing nearby food donation locations
- Enable volunteers to easily find donation locations

### 3.6 Admin Panel

**Admin Capabilities**
- View all donations
- Approve NGOs
- Monitor activity
- Remove fake accounts

## 4. Additional Features

- Real-time notifications
- Donation status tracking
- Food safety timer
- Impact dashboard showing meals served

## 5. Technical Requirements

- Frontend: React or Next.js
- Backend: Node.js
- Database: Firebase or Supabase
- Mobile responsive design
- Google Maps integration for location services