import { useState, useCallback } from 'react';
import { learnersService } from '../services/learners.service';
import { useUserStore } from '../stores/user.store';
import { router } from 'expo-router';
import type { LearnerProfile } from '../types/user.types';

export interface OnboardingState {
  displayName: string;
  country: string;
  role: 'learner' | 'sponsor';
  incomeType: string;
  skills: string[];
  goals: string[];
  githubUrl: string;
  linkedinUrl: string;
}

export const useOnboarding = () => {
  const { setOnboardingComplete, setProfile, profile } = useUserStore();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingState, string>>>({});

  const [formData, setFormData] = useState<OnboardingState>({
    displayName: profile?.displayName || '',
    country: profile?.country || '',
    role: 'learner',
    incomeType: '',
    skills: [],
    goals: [],
    githubUrl: '',
    linkedinUrl: '',
  });

  const updateFormData = useCallback((data: Partial<OnboardingState>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear error when field is updated
    if (Object.keys(data).length > 0) {
      const field = Object.keys(data)[0] as keyof OnboardingState;
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, []);

  const validateStep = (currentStep: number) => {
    const newErrors: Partial<Record<keyof OnboardingState, string>> = {};

    if (currentStep === 0) {
      if (!formData.displayName.trim()) newErrors.displayName = 'Full name is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
    } else if (currentStep === 1) {
      if (!formData.incomeType) newErrors.incomeType = 'Income range is required';
    } else if (currentStep === 2) {
      if (formData.goals.length < 1) newErrors.goals = 'At least one goal is required';
      if (formData.skills.length > 15) newErrors.skills = 'Maximum 15 skills allowed';
    } else if (currentStep === 3) {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (formData.githubUrl && !urlRegex.test(formData.githubUrl)) {
        newErrors.githubUrl = 'Invalid GitHub URL';
      }
      if (formData.linkedinUrl && !urlRegex.test(formData.linkedinUrl)) {
        newErrors.linkedinUrl = 'Invalid LinkedIn URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
      return true;
    }
    return false;
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const submit = async (isSkip = false) => {
    if (!isSkip && !validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<LearnerProfile> = {
        displayName: formData.displayName,
        country: formData.country,
        role: formData.role,
        incomeType: formData.incomeType,
        skills: formData.skills,
        goals: formData.goals,
        onboardingComplete: true,
      };

      if (!isSkip) {
        if (formData.githubUrl) payload.githubUrl = formData.githubUrl;
        if (formData.linkedinUrl) payload.linkedinUrl = formData.linkedinUrl;
      }

      await learnersService.updateProfile(payload);

      if (profile) {
        setProfile({ ...profile, ...payload });
      }

      setOnboardingComplete(true);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    formData,
    errors,
    isSubmitting,
    updateFormData,
    nextStep,
    prevStep,
    submit,
  };
};
