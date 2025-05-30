import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/types';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login(email, password, role);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>
      
      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          error={errors.email}
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />
        
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Login as:</Text>
          <View style={styles.roleButtons}>
            <Button
              title="Customer"
              onPress={() => setRole('customer')}
              variant={role === 'customer' ? 'primary' : 'outline'}
              size="small"
              style={styles.roleButton}
            />
            <Button
              title="Barber"
              onPress={() => setRole('barber')}
              variant={role === 'barber' ? 'primary' : 'outline'}
              size="small"
              style={styles.roleButton}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Login" 
          onPress={handleLogin} 
          loading={isLoading}
          style={styles.button}
          size="large"
        />
        
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Button 
            title="Sign Up" 
            onPress={() => router.push('/auth/role-select')} 
            variant="outline" 
            size="small"
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
  contentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  form: {
    marginBottom: 32,
  },
  roleContainer: {
    marginTop: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
  },
  buttonContainer: {
    gap: 24,
  },
  button: {
    width: '100%',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
});