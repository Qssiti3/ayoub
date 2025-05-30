export type UserRole = 'customer' | 'barber';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Barber extends User {
  role: 'barber';
  services: string[];
  rating: number;
  reviews: number;
  experience: number;
  bio: string;
  price: number;
  location?: Location;
  availability: {
    [key: string]: string[]; // day: available times
  };
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Appointment {
  id: string;
  barberId: string;
  customerId: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}