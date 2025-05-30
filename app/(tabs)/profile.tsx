import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  MapPin
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
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

interface MapPressEvent {
  nativeEvent: {
    coordinate: {
      latitude: number;
      longitude: number;
    };
  };
}

interface MarkerDragEvent {
  nativeEvent: {
    coordinate: {
      latitude: number;
      longitude: number;
    };
  };
}

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { getBarberById, updateBarberLocation } = useBarbersStore();
  
  const isBarber = user?.role === 'barber';
  const barber = isBarber ? getBarberById(user.id) : null;
  
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    barber?.location ? {
      latitude: barber.location.latitude,
      longitude: barber.location.longitude,
    } : null
  );
  
  const handleLogout = () => {
    logout();
    router.replace('/');
  };
  
  const handleSetCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Location features are not available on web.');
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access to set your current location.');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location.');
    }
  };
  
  const handleMapPress = (event: MapPressEvent) => {
    if (isEditingLocation && event.nativeEvent) {
      setSelectedLocation(event.nativeEvent.coordinate);
    }
  };
  
  const handleMarkerDragEnd = (event: MarkerDragEvent) => {
    if (event.nativeEvent) {
      setSelectedLocation(event.nativeEvent.coordinate);
    }
  };
  
  const handleSaveLocation = async () => {
    if (!user || !selectedLocation) return;
    
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Location features are not available on web.');
      return;
    }
    
    try {
      // Get address from coordinates
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      
      const address = geocode ? 
        `${geocode.street || ''}, ${geocode.city || ''}, ${geocode.region || ''}` : 
        'Unknown location';
      
      await updateBarberLocation(user.id, {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: address.trim(),
      });
      
      setIsEditingLocation(false);
      Alert.alert('Success', 'Your location has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update location.');
    }
  };
  
  const menuItems = [
    {
      icon: <User size={20} color={Colors.light.primary} />,
      title: 'Personal Information',
      onPress: () => {},
    },
    {
      icon: <Calendar size={20} color={Colors.light.primary} />,
      title: 'My Appointments',
      onPress: () => router.push('/(tabs)/appointments'),
    },
    {
      icon: <Settings size={20} color={Colors.light.primary} />,
      title: 'Settings',
      onPress: () => {},
    },
    {
      icon: <HelpCircle size={20} color={Colors.light.primary} />,
      title: 'Help & Support',
      onPress: () => {},
    },
  ];

  // Web fallback for map
  const WebMapFallback = () => (
    <View style={styles.webMapFallback}>
      <MapPin size={48} color={Colors.light.primary} />
      <Text style={styles.webMapText}>
        Map functionality is not available on web. Please use the mobile app to set your location.
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=2080' }} 
            style={styles.profileImage} 
          />
          
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>{user?.role === 'barber' ? 'Barber' : 'Customer'}</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Mail size={16} color={Colors.light.subtext} style={styles.contactIcon} />
              <Text style={styles.contactText}>{user?.email}</Text>
            </View>
            
            {user?.phone && (
              <View style={styles.contactItem}>
                <Phone size={16} color={Colors.light.subtext} style={styles.contactIcon} />
                <Text style={styles.contactText}>{user.phone}</Text>
              </View>
            )}
          </View>
          
          <Button 
            title="Edit Profile" 
            onPress={() => {}} 
            variant="outline"
            style={styles.editButton}
          />
        </View>
        
        {isBarber && (
          <View style={styles.locationSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Location</Text>
              {!isEditingLocation ? (
                <TouchableOpacity 
                  style={styles.editLocationButton}
                  onPress={() => setIsEditingLocation(true)}
                >
                  <Text style={styles.editLocationText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsEditingLocation(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {barber?.location && !isEditingLocation ? (
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
                <View style={styles.addressContainer}>
                  <MapPin size={16} color={Colors.light.primary} style={styles.locationIcon} />
                  <Text style={styles.addressText}>{barber.location.address || 'Your location'}</Text>
                </View>
              </View>
            ) : isEditingLocation ? (
              <View>
                <View style={styles.mapContainer}>
                  {Platform.OS === 'web' || !MapView ? (
                    <WebMapFallback />
                  ) : (
                    <MapView
                      style={styles.map}
                      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                      initialRegion={{
                        latitude: selectedLocation?.latitude || 33.5731104,
                        longitude: selectedLocation?.longitude || -7.5898434,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      onPress={handleMapPress}
                    >
                      {selectedLocation && (
                        <Marker
                          coordinate={selectedLocation}
                          draggable
                          onDragEnd={handleMarkerDragEnd}
                        >
                          <MapPin size={24} color={Colors.light.primary} />
                        </Marker>
                      )}
                    </MapView>
                  )}
                </View>
                {Platform.OS !== 'web' && (
                  <>
                    <Text style={styles.mapInstructions}>
                      Tap on the map to set your location or drag the marker to adjust
                    </Text>
                    <View style={styles.locationButtons}>
                      <Button
                        title="Use Current Location"
                        onPress={handleSetCurrentLocation}
                        variant="outline"
                        style={styles.currentLocationButton}
                      />
                      <Button
                        title="Save Location"
                        onPress={handleSaveLocation}
                        disabled={!selectedLocation}
                        style={styles.saveLocationButton}
                      />
                    </View>
                  </>
                )}
              </View>
            ) : (
              <View style={styles.noLocationContainer}>
                <Text style={styles.noLocationText}>
                  You haven't set your location yet. Set your location to let customers find you on the map.
                </Text>
                <Button
                  title="Set Location"
                  onPress={() => setIsEditingLocation(true)}
                  style={styles.setLocationButton}
                />
              </View>
            )}
          </View>
        )}
        
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                {item.icon}
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <ChevronRight size={20} color={Colors.light.subtext} />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={Colors.light.error} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 16,
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  editButton: {
    paddingHorizontal: 32,
  },
  locationSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingBottom: 24,
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
  editLocationButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
  },
  editLocationText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  cancelText: {
    fontSize: 14,
    color: Colors.light.error,
    fontWeight: '500',
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
    marginBottom: 16,
  },
  locationIcon: {
    marginRight: 8,
  },
  addressText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  noLocationContainer: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  noLocationText: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  setLocationButton: {
    width: '100%',
  },
  mapInstructions: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  locationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  currentLocationButton: {
    flex: 1,
  },
  saveLocationButton: {
    flex: 1,
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.light.error,
    fontWeight: '500',
  },
});