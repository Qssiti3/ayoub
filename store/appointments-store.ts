import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '@/types';

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  fetchUserAppointments: (userId: string) => Promise<Appointment[]>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set, get) => ({
      appointments: [],
      isLoading: false,
      
      bookAppointment: async (appointmentData) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newAppointment: Appointment = {
            id: Date.now().toString(),
            ...appointmentData,
            status: 'pending'
          };
          
          set(state => ({
            appointments: [...state.appointments, newAppointment],
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to book appointment:', error);
          set({ isLoading: false });
          throw new Error('Failed to book appointment');
        }
      },
      
      fetchUserAppointments: async (userId: string) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const userAppointments = get().appointments.filter(
            app => app.customerId === userId || app.barberId === userId
          );
          
          set({ isLoading: false });
          return userAppointments;
        } catch (error) {
          console.error('Failed to fetch appointments:', error);
          set({ isLoading: false });
          return [];
        }
      },
      
      cancelAppointment: async (appointmentId: string) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            appointments: state.appointments.map(app => 
              app.id === appointmentId ? { ...app, status: 'cancelled' } : app
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to cancel appointment:', error);
          set({ isLoading: false });
          throw new Error('Failed to cancel appointment');
        }
      },
    }),
    {
      name: 'appointments-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);