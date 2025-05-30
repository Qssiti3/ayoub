import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Service } from '@/types';
import Colors from '@/constants/colors';
import { Scissors, Droplet, Sparkles } from 'lucide-react-native';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export default function ServiceCard({ service, onPress }: ServiceCardProps) {
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      color: Colors.light.primary,
      strokeWidth: 2
    };
    
    switch (service.icon) {
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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.name}>{service.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginRight: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(65, 105, 225, 0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
  },
});