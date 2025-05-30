import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useBarbersStore } from '@/store/barbers-store';
import { useServicesStore } from '@/store/services-store';
import { useAuthStore } from '@/store/auth-store';
import { useAppointmentsStore } from '@/store/appointments-store';
import Button from '@/components/Button';
import DaySelector from '@/components/DaySelector';
import TimeSlot from '@/components/TimeSlot';

export default function BookAppointmentScreen() {
  const { barberId } = useLocalSearchParams<{ barberId: string }>();
  const { getBarberById } = useBarbersStore();
  const { services } = useServicesStore();
  const user = useAuthStore((state) => state.user);
  const { bookAppointment, isLoading } = useAppointmentsStore();
  
  const barber = getBarberById(barberId || '');
  
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  useEffect(() => {
    if (barber && barber.services.length > 0 && services.length > 0) {
      const defaultService = services.find(s => 
        s.name.toLowerCase() === barber.services[0].toLowerCase()
      );
      if (defaultService) {
        setSelectedService(defaultService.id);
      }
    }
  }, [barber, services]);
  
  if (!barber || !user) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Barber not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }
  
  const getAvailableTimes = () => {
    return barber.availability[selectedDay] || [];
  };
  
  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : '';
  };
  
  const handleBookAppointment = async () => {
    if (!selectedService || !selectedTime) {
      Alert.alert('Error', 'Please select a service and time');
      return;
    }
    
    try {
      // Format date
      const today = new Date();
      const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(selectedDay);
      const daysToAdd = (dayIndex - today.getDay() + 7) % 7;
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + daysToAdd);
      
      const formattedDate = appointmentDate.toISOString().split('T')[0];
      
      await bookAppointment({
        barberId: barber.id,
        customerId: user.id,
        date: formattedDate,
        time: selectedTime,
        service: getServiceName(selectedService),
      });
      
      Alert.alert(
        'Success',
        'Your appointment has been booked successfully',
        [{ text: 'OK', onPress: () => router.push('/(tabs)/appointments') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Book an Appointment</Text>
        <Text style={styles.subtitle}>Select date, time and service</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Time</Text>
        <View style={styles.timeContainer}>
          {getAvailableTimes().length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getAvailableTimes().map((time) => (
                <TimeSlot
                  key={time}
                  time={time}
                  selected={selectedTime === time}
                  onPress={() => setSelectedTime(time)}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noTimesText}>No available times for this day</Text>
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Service</Text>
        <View style={styles.servicesContainer}>
          {services
            .filter(service => 
              barber.services.includes(service.name.toLowerCase())
            )
            .map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceItem,
                  selectedService === service.id && styles.selectedServiceItem
                ]}
                onPress={() => setSelectedService(service.id)}
              >
                <Text 
                  style={[
                    styles.serviceName,
                    selectedService === service.id && styles.selectedServiceName
                  ]}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
      
      <View style={styles.barberSection}>
        <Text style={styles.sectionTitle}>Barber</Text>
        <View style={styles.barberCard}>
          <Image source={{ uri: barber.avatar }} style={styles.barberImage} />
          <View style={styles.barberInfo}>
            <Text style={styles.barberName}>{barber.name}</Text>
            <Text style={styles.barberProfession}>Senior Barber</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color={Colors.light.rating} fill={Colors.light.rating} />
              <Text style={styles.ratingText}>{barber.rating}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{selectedDay}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{selectedTime || 'Not selected'}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>
              {selectedService ? getServiceName(selectedService) : 'Not selected'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.priceValue}>{barber.price} DH</Text>
          </View>
        </View>
      </View>
      
      <Button
        title="Confirm Booking"
        onPress={handleBookAppointment}
        loading={isLoading}
        disabled={!selectedService || !selectedTime}
        style={styles.confirmButton}
        size="large"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  timeContainer: {
    marginBottom: 8,
  },
  noTimesText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontStyle: 'italic',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceItem: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedServiceItem: {
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    borderColor: Colors.light.primary,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  selectedServiceName: {
    color: Colors.light.primary,
  },
  barberSection: {
    marginBottom: 24,
  },
  barberCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  barberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  barberProfession: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginLeft: 4,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  confirmButton: {
    marginBottom: 32,
  },
});