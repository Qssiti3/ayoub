import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email, password, role) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const user: User = {
            id: '1',
            name: role === 'barber' ? 'Ahmed Barber' : 'Mohammed Customer',
            email,
            role,
            avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=2080'
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Login failed:', error);
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }
      },
      
      register: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: '1',
            name,
            email,
            role,
            avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=2080'
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Registration failed:', error);
          set({ isLoading: false });
          throw new Error('Registration failed');
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);