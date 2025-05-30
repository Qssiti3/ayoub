import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/colors';

interface DaySelectorProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
}

export default function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      full: `${days[date.getDay()]} ${date.getDate()}`
    };
  });

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {dates.map((item) => (
        <TouchableOpacity
          key={item.full}
          style={[
            styles.dayContainer,
            selectedDay === item.day && styles.selectedDayContainer
          ]}
          onPress={() => onSelectDay(item.day)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dayText,
              selectedDay === item.day && styles.selectedDayText
            ]}
          >
            {item.day}
          </Text>
          <Text
            style={[
              styles.dateText,
              selectedDay === item.day && styles.selectedDateText
            ]}
          >
            {item.date}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  dayContainer: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedDayContainer: {
    backgroundColor: Colors.light.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
});