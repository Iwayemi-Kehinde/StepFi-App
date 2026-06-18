import React, { useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useOnboarding } from '../../hooks/useOnboarding';
import { colors } from '../../constants/colors';
import { PersonalInfoStep } from '../../components/onboarding/PersonalInfoStep';
import { BackgroundStep } from '../../components/onboarding/BackgroundStep';
import { SkillsGoalsStep } from '../../components/onboarding/SkillsGoalsStep';
import { OnlinePresenceStep } from '../../components/onboarding/OnlinePresenceStep';
import { Button } from '../../components/shared/Button';
import { ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { step, formData, errors, isSubmitting, updateFormData, nextStep, prevStep, submit } =
    useOnboarding();

  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (step < 3) {
      if (nextStep()) {
        flatListRef.current?.scrollToIndex({ index: step + 1, animated: true });
      }
    } else {
      submit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      prevStep();
      flatListRef.current?.scrollToIndex({ index: step - 1, animated: true });
    }
  };

  const handleSkip = () => {
    submit(true);
  };

  const steps = [
    <PersonalInfoStep
      key="personal-info"
      displayName={formData.displayName}
      country={formData.country}
      errors={errors}
      onUpdate={updateFormData}
    />,
    <BackgroundStep
      key="background"
      incomeType={formData.incomeType}
      errors={errors}
      onUpdate={updateFormData}
    />,
    <SkillsGoalsStep
      key="skills-goals"
      skills={formData.skills}
      goals={formData.goals}
      errors={errors}
      onUpdate={updateFormData}
    />,
    <OnlinePresenceStep
      key="online-presence"
      githubUrl={formData.githubUrl}
      linkedinUrl={formData.linkedinUrl}
      errors={errors}
      onUpdate={updateFormData}
    />,
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        {/* Header / Progress Bar */}
        <View className="px-6 py-4">
          <View className="mb-4 flex-row items-center justify-between">
            {step > 0 ? (
              <TouchableOpacity onPress={handleBack} className="-ml-2 p-2">
                <ChevronLeft size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            ) : (
              <View className="w-10" />
            )}
            <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Step {step + 1} of 4
            </Text>
            <View className="w-10" />
          </View>
          <View className="h-1.5 w-full rounded-full" style={{ backgroundColor: colors.subtle }}>
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: colors.brandBlue,
                width: `${((step + 1) / 4) * 100}%`,
              }}
            />
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={steps}
          renderItem={({ item }) => <View style={{ width }}>{item}</View>}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
        />

        <View className="gap-4 px-6 py-8">
          <Button
            label={step === 3 ? 'Complete Profile' : 'Continue'}
            onPress={handleNext}
            isLoading={isSubmitting}
          />
          {step === 3 && (
            <TouchableOpacity onPress={handleSkip} disabled={isSubmitting}>
              <Text
                className="text-center text-sm font-medium"
                style={{ color: colors.textSecondary }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
