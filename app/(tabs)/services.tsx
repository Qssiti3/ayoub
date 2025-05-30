import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Scissors, Droplet, Sparkles, Plus, Edit, Trash } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';

export default function ServicesScreen() {
  const user = useAuthStore((state) => state.user);
  
  const [services, setServices] = useState([
    { id: '1', name: 'Haircut', price: 120, active: true, icon: 'scissors' },
    { id: '2', name: 'Beard Trim', price: 80, active: true, icon: 'scissors' },
    { id: '3', name: 'Styling', price: 100, active: true, icon: 'scissors' },
    { id: '4', name: 'Coloring', price: 200, active: false, icon: 'droplet' },
    { id: '5', name: 'Facial', price: 150, active: false, icon: 'sparkles' },
  ]);
  
  const toggleServiceActive = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
  };
  
  const renderIcon = (iconName: string) => {
    const iconProps = {
      size: 24,
      color: Colors.light.primary,
      strokeWidth: 2
    };
    
    switch (iconName) {
      case 'scissors':
        return <Scissors {...iconProps} />;
      case 'droplet':
        return <Droplet {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      default:
        return <Scissors {...iconProps} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Services</Text>
          <Text style={styles.subtitle}>Manage the services you offer to customers</Text>
        </View>
        
        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                {renderIcon(service.icon)}
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price} DH</Text>
              </View>
              
              <View style={styles.serviceActions}>
                <Switch
                  value={service.active}
                  onValueChange={() => toggleServiceActive(service.id)}
                  trackColor={{ false: Colors.light.border, true: 'rgba(65, 105, 225, 0.4)' }}
                  thumbColor={service.active ? Colors.light.primary : '#f4f3f4'}
                />
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Edit size={16} color={Colors.light.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Trash size={16} color={Colors.light.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        <Button
          title="Add New Service"
          onPress={() => {}}
          style={styles.addButton}
          size="large"
        />
        
        <View style={styles.availabilitySection}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          <Text style={styles.sectionSubtitle}>Set your availability for appointments</Text>
          
          <View style={styles.daysContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <View key={day} style={styles.dayItem}>
                <Text style={styles.dayName}>{day}</Text>
                <View style={styles.timeRange}>
                  <Text style={styles.timeText}>
                    {day === 'Sun' ? 'Off' : '9:00 AM - 5:00 PM'}
                  </Text>
                  <TouchableOpacity>
                    <Edit size={16} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
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
  servicesContainer: {
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  serviceActions: {
    alignItems: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    marginBottom: 32,
  },
  availabilitySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 16,
  },
  daysContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dayName: {
    width: 40,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  timeRange: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
});