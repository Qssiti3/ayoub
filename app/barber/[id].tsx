import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Star, Calendar, Clock, MapPin, Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useBarbersStore } from '@/store/barbers-store';
import Button from '@/components/Button';

// Conditional import for MapView
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  try {
    const MapModule = require('react-native-maps');
    MapView = MapModule.default;
    Marker = MapModule.Marker;
    PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
  } catch (error) {
    console.log('react-native-maps not available');
  }
}

export default function BarberProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBarberById } = useBarbersStore();
  const barber = getBarberById(id || '');
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!barber) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Barber not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }
  
  const handleBookAppointment = () => {
    router.push({
      pathname: '/appointment/new',
      params: { barberId: barber.id }
    });
  };

  // Web fallback for map
  const WebMapFallback = () => (
    <View style={styles.webMapFallback}>
      <MapPin size={48} color={Colors.light.primary} />
      <Text style={styles.webMapText}>
        Map view is not available on web. Location: {barber.location?.address || 'At your home address'}
      </Text>
    </View>
  );
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: barber.avatar }} style={styles.barberImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Heart 
            size={24} 
            color={isFavorite ? Colors.light.error : '#FFFFFF'} 
            fill={isFavorite ? Colors.light.error : 'transparent'} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{barber.name}</Text>
            <Text style={styles.profession}>Senior Barber</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.light.rating} fill={Colors.light.rating} />
            <Text style={styles.rating}>{barber.rating}</Text>
            <Text style={styles.reviews}>({barber.reviews} reviews)</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{barber.reviews}+</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{barber.experience}+</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{barber.services.length}</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{barber.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesContainer}>
            {barber.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Text style={styles.serviceName}>{service}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          {barber.location ? (
            <View>
              <View style={styles.mapContainer}>
                {Platform.OS === 'web' || !MapView ? (
                  <WebMapFallback />
                ) : (
                  <MapView
                    style={styles.map}
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                    initialRegion={{
                      latitude: barber.location.latitude,
                      longitude: barber.location.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: barber.location.latitude,
                        longitude: barber.location.longitude,
                      }}
                    >
                      <MapPin size={24} color={Colors.light.primary} />
                    </Marker>
                  </MapView>
                )}
              </View>
              {barber.location.address && (
                <View style={styles.addressContainer}>
                  <MapPin size={20} color={Colors.light.primary} style={styles.locationIcon} />
                  <Text style={styles.locationText}>{barber.location.address}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.locationContainer}>
              <MapPin size={20} color={Colors.light.primary} style={styles.locationIcon} />
              <Text style={styles.locationText}>At your home address</Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>{barber.price} DH</Text>
          </View>
          
          <Button 
            title="Book Appointment" 
            onPress={handleBookAppointment} 
            size="large"
            style={styles.bookButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  imageContainer: {
    position: 'relative',
  },
  barberImage: {
    width: '100%',
    height: 300,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  profession: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: 8,
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
  bioText: {
    fontSize: 14,
    color: Colors.light.subtext,
    lineHeight: 22,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceItem: {
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary,
    padding: 20,
  },
  webMapText: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  bookButton: {
    flex: 1,
    marginLeft: 16,
  },
});