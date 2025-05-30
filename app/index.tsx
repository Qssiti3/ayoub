import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function WelcomeScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['rgba(65, 105, 225, 0.9)', 'rgba(65, 105, 225, 0.7)']}
        style={styles.background}
      />
      
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070' }} 
          style={styles.logoImage}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>BarberHome</Text>
        <Text style={styles.subtitle}>Professional Haircuts at Your Doorstep</Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Expert Barbers</Text>
            <Text style={styles.featureDescription}>Skilled professionals with years of experience</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Home Service</Text>
            <Text style={styles.featureDescription}>Get haircuts in the comfort of your home</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Easy Booking</Text>
            <Text style={styles.featureDescription}>Book appointments with just a few taps</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Get Started" 
            onPress={() => router.push('/auth/role-select')} 
            style={styles.button}
            size="large"
          />
          <Button 
            title="Login" 
            onPress={() => router.push('/auth/login')} 
            variant="outline" 
            style={styles.button}
            size="large"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '60%',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  featureContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  feature: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});