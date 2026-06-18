import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';
import { Plus, X } from 'lucide-react-native';

interface SkillsGoalsStepProps {
  skills: string[];
  goals: string[];
  errors: Partial<Record<string, string>>;
  onUpdate: (data: any) => void;
}

export function SkillsGoalsStep({ skills, goals, errors, onUpdate }: SkillsGoalsStepProps) {
  const [skillInput, setSkillInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && skills.length < 15) {
      if (!skills.includes(skillInput.trim())) {
        onUpdate({ skills: [...skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    onUpdate({ skills: skills.filter((s) => s !== skill) });
  };

  const addGoal = () => {
    if (goalInput.trim()) {
      if (!goals.includes(goalInput.trim())) {
        onUpdate({ goals: [...goals, goalInput.trim()] });
      }
      setGoalInput('');
    }
  };

  const removeGoal = (goal: string) => {
    onUpdate({ goals: goals.filter((g) => g !== goal) });
  };

  return (
    <ScrollView className="flex-1 gap-8 px-6">
      <View>
        <Text className="mb-2 text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Skills & Goals
        </Text>
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Tell us about your background and what you want to achieve.
        </Text>
      </View>

      <View className="gap-4">
        <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
          Skills (Max 15)
        </Text>
        <View className="flex-row gap-2">
          <TextInput
            className="h-12 flex-1 rounded-xl px-4 text-base"
            style={{
              backgroundColor: colors.subtle,
              borderWidth: 1,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            placeholder="Add a skill (e.g. React Native)"
            placeholderTextColor={colors.textMuted}
            value={skillInput}
            onChangeText={setSkillInput}
            onSubmitEditing={addSkill}
            editable={skills.length < 15}
          />
          <TouchableOpacity
            onPress={addSkill}
            className="h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: colors.brandBlue }}
            disabled={skills.length >= 15}>
            <Plus size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {skills.map((skill) => (
            <View
              key={skill}
              className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
              style={{
                backgroundColor: colors.brandBlueDim,
                borderWidth: 1,
                borderColor: colors.brandBlue,
              }}>
              <Text className="text-sm" style={{ color: colors.textPrimary }}>
                {skill}
              </Text>
              <TouchableOpacity onPress={() => removeSkill(skill)}>
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {skills.length >= 15 && (
          <Text className="text-xs" style={{ color: colors.error }}>
            Maximum 15 skills reached
          </Text>
        )}
      </View>

      <View className="gap-4">
        <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
          Goals (Min 1)
        </Text>
        <View className="flex-row gap-2">
          <TextInput
            className="h-12 flex-1 rounded-xl px-4 text-base"
            style={{
              backgroundColor: colors.subtle,
              borderWidth: 1,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            placeholder="Add a goal (e.g. Find a sponsor)"
            placeholderTextColor={colors.textMuted}
            value={goalInput}
            onChangeText={setGoalInput}
            onSubmitEditing={addGoal}
          />
          <TouchableOpacity
            onPress={addGoal}
            className="h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: colors.brandGreen }}>
            <Plus size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {goals.map((goal) => (
            <View
              key={goal}
              className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
              style={{
                backgroundColor: colors.brandGreenDim,
                borderWidth: 1,
                borderColor: colors.brandGreen,
              }}>
              <Text className="text-sm" style={{ color: colors.textPrimary }}>
                {goal}
              </Text>
              <TouchableOpacity onPress={() => removeGoal(goal)}>
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {errors.goals && (
          <Text className="text-xs" style={{ color: colors.error }}>
            {errors.goals}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
