import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Scissors, User } from 'lucide-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { UserRole } from '@/types';

export default function RoleSelectScreen() {
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  
  const handleContinue = () => {
    if (selectedRole) {
      router.push({
        pathname: '/auth/register',
        params: { role: selectedRole }
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>Select how you want to use BarberHome</Text>
      </View>
      
      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'customer' && styles.selectedRoleCard
          ]}
          onPress={() => setSelectedRole('customer')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, selectedRole === 'customer' && styles.selectedIconContainer]}>
            <User size={32} color={selectedRole === 'customer' ? '#FFFFFF' : Colors.light.primary} />
          </View>
          <Text style={styles.roleTitle}>Customer</Text>
          <Text style={styles.roleDescription}>
            Book appointments with professional barbers for haircuts at your home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'barber' && styles.selectedRoleCard
          ]}
          onPress={() => setSelectedRole('barber')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, selectedRole === 'barber' && styles.selectedIconContainer]}>
            <Scissors size={32} color={selectedRole === 'barber' ? '#FFFFFF' : Colors.light.primary} />
          </View>
          <Text style={styles.roleTitle}>Barber</Text>
          <Text style={styles.roleDescription}>
            Offer your professional haircut services to customers at their homes
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Continue" 
          onPress={handleContinue} 
          disabled={!selectedRole}
          style={styles.button}
          size="large"
        />
        <Button 
          title="Back" 
          onPress={() => router.back()} 
          variant="outline" 
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginTop: 8,
  },
  rolesContainer: {
    flex: 1,
    gap: 20,
  },
  roleCard: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoleCard: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(65, 105, 225, 0.05)',
  },
  iconContainer: {
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedIconContainer: {
    backgroundColor: Colors.light.primary,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});