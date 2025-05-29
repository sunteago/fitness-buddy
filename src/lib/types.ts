
import type { GENDER_OPTIONS, GOAL_OPTIONS, DIETARY_PREFERENCE_OPTIONS } from './constants';

export type Gender = typeof GENDER_OPTIONS[number];
export type Goal = typeof GOAL_OPTIONS[number];
export type DietaryPreference = typeof DIETARY_PREFERENCE_OPTIONS[number];

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  goal: Goal;
  bmi: number;
  dietaryPreference?: DietaryPreference; // Added dietary preference
}

export interface NutritionEntry {
  id: string;
  foodName: string;
  portionSize: string; // Changed from number to string
  calories: number; // Will be AI estimated
  timestamp: number; // Unix timestamp
  aiNotes?: string; // Optional field for AI estimation notes
}

export interface ExerciseEntry {
  id: string;
  exerciseName: string;
  duration: number; // in minutes
  caloriesBurned: number;
  timestamp: number; // Unix timestamp
}

export interface DailyLog {
  nutrition: NutritionEntry[];
  exercise: ExerciseEntry[];
}
