import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Barber } from '@/types';
import Colors from '@/constants/colors';
import { Star } from 'lucide-react-native';

interface BarberCardProps {
  barber: Barber;
  onPress: () => void;
}

export default function BarberCard({ barber, onPress }: BarberCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: barber.avatar }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Dr. {barber.name}</Text>
        <Text style={styles.profession}>Senior Barber</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>10:30 AM-3:30</Text>
          <Text style={styles.price}>Fee: {barber.price} DH</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Star size={16} color={Colors.light.rating} fill={Colors.light.rating} />
        <Text style={styles.rating}>{barber.rating}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  profession: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  price: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  ratingContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 4,
  },
});