import React from 'react';
import { View, Text } from 'react-native';
import { Input } from '../shared/Input';
import { colors } from '../../constants/colors';

interface PersonalInfoStepProps {
  displayName: string;
  country: string;
  errors: Partial<Record<string, string>>;
  onUpdate: (data: any) => void;
}

export function PersonalInfoStep({
  displayName,
  country,
  errors,
  onUpdate,
}: PersonalInfoStepProps) {
  return (
    <View className="flex-1 gap-6 px-6">
      <View>
        <Text className="mb-2 text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Personal Info
        </Text>
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Let&apos;s start with the basics to personalize your experience.
        </Text>
      </View>

      <Input
        label="Full Name"
        value={displayName}
        onChangeText={(text) => onUpdate({ displayName: text })}
        placeholder="John Doe"
        error={errors.displayName}
      />

      <Input
        label="Country"
        value={country}
        onChangeText={(text) => onUpdate({ country: text })}
        placeholder="United States"
        error={errors.country}
      />
    </View>
  );
}
