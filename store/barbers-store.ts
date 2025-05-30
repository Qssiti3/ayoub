import { create } from 'zustand';
import { Barber, Location } from '@/types';

interface BarbersState {
  barbers: Barber[];
  featuredBarbers: Barber[];
  isLoading: boolean;
  fetchBarbers: () => Promise<void>;
  getBarberById: (id: string) => Barber | undefined;
  updateBarberLocation: (barberId: string, location: Location) => Promise<void>;
}

export const useBarbersStore = create<BarbersState>((set, get) => ({
  barbers: [],
  featuredBarbers: [],
  isLoading: false,
  
  fetchBarbers: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBarbers: Barber[] = [
        {
          id: '1',
          name: 'Hassan Ali',
          email: 'hassan@example.com',
          role: 'barber',
          avatar: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070',
          services: ['haircut', 'beard', 'styling'],
          rating: 4.9,
          reviews: 86,
          experience: 5,
          bio: 'Professional barber with 5 years of experience specializing in modern cuts and beard styling.',
          price: 120,
          location: {
            latitude: 33.5731104,
            longitude: -7.5898434,
            address: 'Casablanca, Morocco'
          },
          availability: {
            'Mon': ['10:00', '12:00', '14:00', '16:00'],
            'Tue': ['10:00', '12:00', '14:00', '16:00'],
            'Wed': ['10:00', '12:00', '14:00', '16:00'],
            'Thu': ['10:00', '12:00', '14:00', '16:00'],
            'Fri': ['10:00', '12:00', '14:00'],
            'Sat': ['10:00', '12:00'],
            'Sun': [],
          }
        },
        {
          id: '2',
          name: 'Karim Mahmoud',
          email: 'karim@example.com',
          role: 'barber',
          avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070',
          services: ['haircut', 'beard', 'coloring'],
          rating: 4.8,
          reviews: 64,
          experience: 3,
          bio: 'Specializing in trendy haircuts and beard grooming with attention to detail.',
          price: 100,
          location: {
            latitude: 33.5950927,
            longitude: -7.6187537,
            address: 'Ain Diab, Casablanca'
          },
          availability: {
            'Mon': ['09:00', '11:00', '13:00', '15:00', '17:00'],
            'Tue': ['09:00', '11:00', '13:00', '15:00', '17:00'],
            'Wed': ['09:00', '11:00', '13:00', '15:00', '17:00'],
            'Thu': ['09:00', '11:00', '13:00', '15:00', '17:00'],
            'Fri': ['09:00', '11:00', '13:00', '15:00'],
            'Sat': ['09:00', '11:00', '13:00'],
            'Sun': [],
          }
        },
        {
          id: '3',
          name: 'Youssef Hamdi',
          email: 'youssef@example.com',
          role: 'barber',
          avatar: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974',
          services: ['haircut', 'beard', 'facial'],
          rating: 5.0,
          reviews: 42,
          experience: 7,
          bio: 'Master barber with expertise in classic and modern styles, facial treatments, and premium grooming services.',
          price: 150,
          location: {
            latitude: 33.5731104,
            longitude: -7.6098434,
            address: 'Maarif, Casablanca'
          },
          availability: {
            'Mon': ['10:30', '12:30', '14:30', '16:30'],
            'Tue': ['10:30', '12:30', '14:30', '16:30'],
            'Wed': ['10:30', '12:30', '14:30', '16:30'],
            'Thu': ['10:30', '12:30', '14:30', '16:30'],
            'Fri': ['10:30', '12:30', '14:30'],
            'Sat': ['10:30', '12:30'],
            'Sun': ['10:30'],
          }
        },
      ];
      
      set({ 
        barbers: mockBarbers,
        featuredBarbers: mockBarbers,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch barbers:', error);
      set({ isLoading: false });
    }
  },
  
  getBarberById: (id: string) => {
    return get().barbers.find(barber => barber.id === id);
  },

  updateBarberLocation: async (barberId: string, location: Location) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        barbers: state.barbers.map(barber => 
          barber.id === barberId ? { ...barber, location } : barber
        ),
        featuredBarbers: state.featuredBarbers.map(barber => 
          barber.id === barberId ? { ...barber, location } : barber
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to update barber location:', error);
      set({ isLoading: false });
    }
  }
}));