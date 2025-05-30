import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions
} from 'react-native';
import Colors from '@/constants/colors';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
  onSubmitEditing?: () => void;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType = 'done',
  autoCapitalize = 'none',
  error,
  style,
  inputStyle,
  labelStyle,
  multiline = false,
  numberOfLines = 1,
  onSubmitEditing,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          multiline ? { height: 24 * numberOfLines, textAlignVertical: 'top' } : null,
          inputStyle
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.subtext}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        onSubmitEditing={onSubmitEditing}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 14,
    marginTop: 4,
  },
});