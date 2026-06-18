import React from 'react';
import { View, Text } from 'react-native';
import { Input } from '../shared/Input';
import { colors } from '../../constants/colors';

interface OnlinePresenceStepProps {
  githubUrl: string;
  linkedinUrl: string;
  errors: Partial<Record<string, string>>;
  onUpdate: (data: any) => void;
}

export function OnlinePresenceStep({
  githubUrl,
  linkedinUrl,
  errors,
  onUpdate,
}: OnlinePresenceStepProps) {
  return (
    <View className="flex-1 gap-6 px-6">
      <View>
        <Text className="mb-2 text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Online Presence
        </Text>
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Connect your professional profiles to boost your reputation score (optional).
        </Text>
      </View>

      <Input
        label="GitHub URL"
        value={githubUrl}
        onChangeText={(text) => onUpdate({ githubUrl: text })}
        placeholder="https://github.com/username"
        autoCapitalize="none"
        error={errors.githubUrl}
      />

      <Input
        label="LinkedIn URL"
        value={linkedinUrl}
        onChangeText={(text) => onUpdate({ linkedinUrl: text })}
        placeholder="https://linkedin.com/in/username"
        autoCapitalize="none"
        error={errors.linkedinUrl}
      />
    </View>
  );
}
