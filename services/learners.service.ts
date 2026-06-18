import api from './api';
import type { LearnerProfile } from '../types/user.types';

export const learnersService = {
  async updateProfile(profileData: Partial<LearnerProfile>): Promise<void> {
    await api.patch('/learners/profile', profileData);
  },
};
