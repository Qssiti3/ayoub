import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Search, Bell, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useBarbersStore } from '@/store/barbers-store';
import { useServicesStore } from '@/store/services-store';
import ServiceCard from '@/components/ServiceCard';
import BarberCard from '@/components/BarberCard';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const { barbers, featuredBarbers, fetchBarbers, isLoading: loadingBarbers } = useBarbersStore();
  const { services, fetchServices, isLoading: loadingServices } = useServicesStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchBarbers();
    fetchServices();
  }, []);
  
  const handleServicePress = (serviceId: string) => {
    // In a real app, this would filter barbers by service
    console.log('Service selected:', serviceId);
  };
  
  const handleBarberPress = (barberId: string) => {
    router.push(`/barber/${barberId}`);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello {user?.name.split(' ')[0]}!</Text>
          </View>
          
          <TouchableOpacity style={styles.profileContainer}>
            <View style={styles.notificationContainer}>
              <Bell size={24} color={Colors.light.text} />
              <View style={styles.notificationBadge} />
            </View>
            {user?.avatar && (
              <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.light.subtext} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search barbers, services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>see all</Text>
            </TouchableOpacity>
          </View>
          
          {loadingServices ? (
            <ActivityIndicator color={Colors.light.primary} size="small" />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesContainer}
            >
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => handleServicePress(service.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
        
        <View style={styles.barbersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Barbers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>see all</Text>
            </TouchableOpacity>
          </View>
          
          {loadingBarbers ? (
            <ActivityIndicator color={Colors.light.primary} size="small" />
          ) : (
            <View style={styles.barbersContainer}>
              {featuredBarbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  onPress={() => handleBarberPress(barber.id)}
                />
              ))}
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    marginRight: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.error,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.light.text,
  },
  filterButton: {
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  servicesContainer: {
    paddingBottom: 8,
  },
  barbersSection: {
    marginBottom: 24,
  },
  barbersContainer: {
    marginBottom: 16,
  },
});