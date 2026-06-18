import { create } from 'zustand';
import type { LearnerProfile, UserRole } from '../types/user.types';

export interface UserReputation {
  score: number;
  tier: string;
  interestRate: number;
  maxCredit: number;
}

interface UserState {
  profile: LearnerProfile | null;
  reputation: UserReputation | null;
  role: UserRole | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  setProfile: (profile: LearnerProfile) => void;
  setReputation: (reputation: UserReputation) => void;
  setRole: (role: UserRole) => void;
  setOnboardingComplete: (complete: boolean) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  reputation: null,
  role: null,
  onboardingComplete: false,
  isLoading: false,

  setProfile: (profile) => set({ profile }),
  setReputation: (reputation) => set({ reputation }),
  setRole: (role) => set({ role }),
  setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
  clearUser: () => set({ profile: null, reputation: null, role: null, onboardingComplete: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
