import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Calendar, Clock, MapPin, X, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useAppointmentsStore } from '@/store/appointments-store';
import { useBarbersStore } from '@/store/barbers-store';
import { Appointment, Barber } from '@/types';
import Button from '@/components/Button';

export default function AppointmentsScreen() {
  const user = useAuthStore((state) => state.user);
  const { appointments, fetchUserAppointments, cancelAppointment, isLoading } = useAppointmentsStore();
  const { barbers, getBarberById } = useBarbersStore();
  
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);
  
  const loadAppointments = async () => {
    if (user) {
      const userApps = await fetchUserAppointments(user.id);
      setUserAppointments(userApps);
    }
  };
  
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
      loadAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };
  
  const getBarberInfo = (barberId: string): Barber | undefined => {
    return getBarberById(barberId);
  };
  
  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const barber = getBarberInfo(item.barberId);
    const isPast = new Date(item.date) < new Date();
    
    if ((activeTab === 'upcoming' && isPast) || (activeTab === 'past' && !isPast)) {
      return null;
    }
    
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.serviceName}>{item.service}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'confirmed' ? styles.confirmedBadge : 
            item.status === 'cancelled' ? styles.cancelledBadge : 
            styles.pendingBadge
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={Colors.light.subtext} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={16} color={Colors.light.subtext} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          
          {barber && (
            <View style={styles.detailItem}>
              <MapPin size={16} color={Colors.light.subtext} style={styles.detailIcon} />
              <Text style={styles.detailText}>At your location</Text>
            </View>
          )}
        </View>
        
        {barber && (
          <View style={styles.barberInfo}>
            <Text style={styles.barberLabel}>Barber:</Text>
            <Text style={styles.barberName}>{barber.name}</Text>
          </View>
        )}
        
        {!isPast && item.status !== 'cancelled' && (
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={() => handleCancelAppointment(item.id)}
              variant="outline"
              size="small"
              style={styles.cancelButton}
            />
            
            {item.status === 'pending' && (
              <Button
                title="Confirm"
                onPress={() => {}}
                size="small"
                style={styles.confirmButton}
              />
            )}
          </View>
        )}
      </View>
    );
  };
  
  const filteredAppointments = userAppointments.filter(app => {
    const isPast = new Date(app.date) < new Date();
    return (activeTab === 'upcoming' && !isPast) || (activeTab === 'past' && isPast);
  });
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.light.primary} size="large" />
        </View>
      ) : filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming appointments" 
              : "You don't have any past appointments"}
          </Text>
          {activeTab === 'upcoming' && (
            <Button
              title="Book an Appointment"
              onPress={() => {}}
              style={styles.bookButton}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={userAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.light.background,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.subtext,
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  bookButton: {
    width: '100%',
  },
  listContainer: {
    paddingBottom: 16,
  },
  appointmentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
  },
  confirmedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.accent,
    textTransform: 'capitalize',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  barberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  barberLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginRight: 4,
  },
  barberName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    minWidth: 100,
  },
  confirmButton: {
    minWidth: 100,
  },
});