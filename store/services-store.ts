import { create } from 'zustand';
import { Service } from '@/types';

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  fetchServices: () => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  isLoading: false,
  
  fetchServices: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Haircut',
          icon: 'scissors',
          description: 'Professional haircut service tailored to your style preferences.'
        },
        {
          id: '2',
          name: 'Beard Trim',
          icon: 'scissors',
          description: 'Expert beard trimming and styling for a clean, polished look.'
        },
        {
          id: '3',
          name: 'Styling',
          icon: 'scissors',
          description: 'Hair styling services including blow-drying, straightening, and more.'
        },
        {
          id: '4',
          name: 'Coloring',
          icon: 'droplet',
          description: 'Professional hair coloring services for a fresh new look.'
        },
        {
          id: '5',
          name: 'Facial',
          icon: 'sparkles',
          description: 'Rejuvenating facial treatments to cleanse and refresh your skin.'
        },
        {
          id: '6',
          name: 'Kids Cut',
          icon: 'scissors',
          description: 'Gentle and patient haircuts for children of all ages.'
        },
      ];
      
      set({ services: mockServices, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch services:', error);
      set({ isLoading: false });
    }
  },
}));