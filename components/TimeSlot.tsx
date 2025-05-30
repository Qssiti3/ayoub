import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface TimeSlotProps {
  time: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function TimeSlot({ time, selected, onPress, disabled = false }: TimeSlotProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
        disabled && styles.disabledContainer
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.timeText,
          selected && styles.selectedText,
          disabled && styles.disabledText
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedContainer: {
    backgroundColor: Colors.light.accent,
  },
  disabledContainer: {
    backgroundColor: Colors.light.secondary,
    opacity: 0.5,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: Colors.light.subtext,
  },
});