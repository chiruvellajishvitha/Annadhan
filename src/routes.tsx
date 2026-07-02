import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import PostDonation from './pages/PostDonation';
import Notifications from './pages/Notifications';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <Signup />,
  },
  {
    name: 'Donor Dashboard',
    path: '/donor',
    element: <DonorDashboard />,
  },
  {
    name: 'Post Donation',
    path: '/donor/post',
    element: <PostDonation />,
  },
  {
    name: 'NGO Dashboard',
    path: '/ngo',
    element: <NGODashboard />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    name: 'Notifications',
    path: '/notifications',
    element: <Notifications />,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
