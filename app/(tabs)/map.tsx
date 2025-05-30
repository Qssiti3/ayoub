import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { MapPin, Search, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useBarbersStore } from '@/store/barbers-store';
import { useAuthStore } from '@/store/auth-store';
import { Barber } from '@/types';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapScreen() {
  const { barbers, isLoading } = useBarbersStore();
  const user = useAuthStore((state) => state.user);
  const isBarber = user?.role === 'barber';
  
  const mapRef = useRef<any>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 33.5731104,
    longitude: -7.5898434,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
        
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
          
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        }
      })();
    }
  }, []);
  
  const handleMarkerPress = (barber: Barber) => {
    setSelectedBarber(barber);
    
    if (barber.location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: barber.location.latitude,
        longitude: barber.location.longitude,
        latitudeDelta: LATITUDE_DELTA / 2,
        longitudeDelta: LONGITUDE_DELTA / 2,
      });
    }
  };
  
  const handleBarberCardPress = (barberId: string) => {
    router.push(`/barber/${barberId}`);
  };
  
  const goToUserLocation = async () => {
    if (Platform.OS === 'web') return;
    
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } else if (locationPermission) {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    }
  };

  // Web fallback component
  const WebMapFallback = () => (
    <View style={styles.webFallbackContainer}>
      <Text style={styles.webFallbackTitle}>Map View</Text>
      <Text style={styles.webFallbackText}>
        Map functionality is not available on web. Please use the mobile app for the full map experience.
      </Text>
      
      <View style={styles.barbersListContainer}>
        <Text style={styles.barbersListTitle}>Available Barbers</Text>
        {barbers.map((barber) => (
          <TouchableOpacity
            key={barber.id}
            style={styles.barberListItem}
            onPress={() => handleBarberCardPress(barber.id)}
          >
            <View style={styles.barberListInfo}>
              <Text style={styles.barberListName}>{barber.name}</Text>
              <Text style={styles.barberListProfession}>Senior Barber</Text>
              <View style={styles.barberListDetails}>
                <Text style={styles.barberListRating}>★ {barber.rating}</Text>
                <Text style={styles.barberListPrice}>{barber.price} DH</Text>
              </View>
              {barber.location?.address && (
                <Text style={styles.barberListAddress}>
                  {barber.location.address}
                </Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => router.push({
                pathname: '/appointment/new',
                params: { barberId: barber.id }
              })}
            >
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.light.subtext} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search barbers nearby...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : Platform.OS === 'web' || !MapView ? (
        <WebMapFallback />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={locationPermission}
            showsMyLocationButton={false}
          >
            {barbers.map((barber) => (
              barber.location && (
                <Marker
                  key={barber.id}
                  coordinate={{
                    latitude: barber.location.latitude,
                    longitude: barber.location.longitude,
                  }}
                  title={barber.name}
                  description={`Rating: ${barber.rating} • ${barber.price} DH`}
                  onPress={() => handleMarkerPress(barber)}
                >
                  <View style={styles.markerContainer}>
                    <MapPin size={24} color={Colors.light.primary} />
                    <View style={styles.markerDot} />
                  </View>
                </Marker>
              )
            ))}
          </MapView>
          
          {/* My Location Button */}
          <TouchableOpacity 
            style={styles.myLocationButton}
            onPress={goToUserLocation}
          >
            <View style={styles.myLocationButtonInner}>
              <MapPin size={20} color={Colors.light.primary} />
            </View>
          </TouchableOpacity>
          
          {/* Selected Barber Card */}
          {selectedBarber && (
            <TouchableOpacity 
              style={styles.barberCardContainer}
              onPress={() => handleBarberCardPress(selectedBarber.id)}
              activeOpacity={0.9}
            >
              <View style={styles.barberCard}>
                <View style={styles.barberInfo}>
                  <Text style={styles.barberName}>{selectedBarber.name}</Text>
                  <Text style={styles.barberProfession}>Senior Barber</Text>
                  <View style={styles.barberDetails}>
                    <Text style={styles.barberRating}>★ {selectedBarber.rating}</Text>
                    <Text style={styles.barberPrice}>{selectedBarber.price} DH</Text>
                  </View>
                  {selectedBarber.location?.address && (
                    <Text style={styles.barberAddress}>
                      {selectedBarber.location.address}
                    </Text>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => router.push({
                    pathname: '/appointment/new',
                    params: { barberId: selectedBarber.id }
                  })}
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 1,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.subtext,
  },
  filterButton: {
    backgroundColor: Colors.light.card,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFallbackContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  webFallbackText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  barbersListContainer: {
    flex: 1,
  },
  barbersListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  barberListItem: {
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
  barberListInfo: {
    flex: 1,
  },
  barberListName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  barberListProfession: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 8,
  },
  barberListDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  barberListRating: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.rating,
    marginRight: 12,
  },
  barberListPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  barberListAddress: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    bottom: 0,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 180,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  myLocationButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barberCardContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  barberCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    marginBottom: 8,
  },
  barberDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  barberRating: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.rating,
    marginRight: 12,
  },
  barberPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  barberAddress: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  bookButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});