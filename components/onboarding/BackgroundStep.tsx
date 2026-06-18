import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';

const INCOME_RANGES = [
  '$0 - $500',
  '$500 - $1,500',
  '$1,500 - $3,000',
  '$3,000 - $5,000',
  '$5,000+',
];

interface BackgroundStepProps {
  incomeType: string;
  errors: Partial<Record<string, string>>;
  onUpdate: (data: any) => void;
}

export function BackgroundStep({ incomeType, errors, onUpdate }: BackgroundStepProps) {
  return (
    <ScrollView className="flex-1 gap-6 px-6">
      <View className="mb-6">
        <Text className="mb-2 text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Financial Background
        </Text>
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          This helps us calculate your initial credit scoring.
        </Text>
      </View>

      <View className="gap-4">
        <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
          Monthly Income Range
        </Text>
        <View className="gap-3">
          {INCOME_RANGES.map((range) => {
            const isSelected = incomeType === range;
            return (
              <TouchableOpacity
                key={range}
                onPress={() => onUpdate({ incomeType: range })}
                className="h-14 flex-row items-center justify-between rounded-xl px-4"
                style={{
                  backgroundColor: isSelected ? colors.brandBlueDim : colors.subtle,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.brandBlue : colors.border,
                }}>
                <Text
                  className="text-base"
                  style={{ color: isSelected ? colors.textPrimary : colors.textSecondary }}>
                  {range}
                </Text>
                {isSelected && (
                  <View
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: colors.brandBlue }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.incomeType && (
          <Text className="text-xs" style={{ color: colors.error }}>
            {errors.incomeType}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
