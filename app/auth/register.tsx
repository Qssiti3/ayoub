import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/types';

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role: UserRole }>();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      await register(name, email, password, role || 'customer');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again later.');
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          {role === 'barber' 
            ? 'Join as a barber and offer your services' 
            : 'Sign up to book haircuts at your home'}
        </Text>
      </View>
      
      <View style={styles.form}>
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          error={errors.name}
        />
        
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
        
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Create Account" 
          onPress={handleRegister} 
          loading={isLoading}
          style={styles.button}
          size="large"
        />
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Button 
            title="Login" 
            onPress={() => router.push('/auth/login')} 
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
  buttonContainer: {
    gap: 24,
  },
  button: {
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
});