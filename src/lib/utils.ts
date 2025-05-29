import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates Body Mass Index (BMI).
 * @param weightInKg Weight in kilograms.
 * @param heightInCm Height in centimeters.
 * @returns BMI value, or 0 if height is invalid.
 */
export function calculateBMI(weightInKg: number, heightInCm: number): number {
  if (heightInCm <= 0) {
    return 0;
  }
  const heightInMeters = heightInCm / 100;
  return parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(2));
}

/**
 * Gets the current date as a string in YYYY-MM-DD format.
 * @returns Date string.
 */
export function getCurrentDateKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
