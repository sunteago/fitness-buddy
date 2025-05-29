
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { NutritionEntry, ExerciseEntry } from '@/lib/types';
import { NUTRITION_LOG_PREFIX, EXERCISE_LOG_PREFIX } from '@/lib/constants';
import { getItem, setItem } from '@/lib/localStorage';
import { getCurrentDateKey } from '@/lib/utils';
import { estimateFoodCalories, type EstimateFoodCaloriesInput } from '@/ai/flows/estimate-food-calories-flow';
import { toast } from '@/hooks/use-toast';

export function useDailyLogs(dateKey?: string) {
  const [currentDateKey, setCurrentDateKey] = useState(dateKey || getCurrentDateKey());
  
  const [nutritionLog, setNutritionLog] = useState<NutritionEntry[]>([]);
  const [exerciseLog, setExerciseLog] = useState<ExerciseEntry[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // Renamed to avoid conflict
  const [isEstimating, setIsEstimating] = useState(false);

  const nutritionStorageKey = `${NUTRITION_LOG_PREFIX}${currentDateKey}`;
  const exerciseStorageKey = `${EXERCISE_LOG_PREFIX}${currentDateKey}`;

  const loadLogs = useCallback(() => {
    setIsLoadingInitial(true);
    const storedNutrition = getItem<NutritionEntry[]>(nutritionStorageKey);
    const storedExercise = getItem<ExerciseEntry[]>(exerciseStorageKey);
    
    setNutritionLog(storedNutrition || []);
    setExerciseLog(storedExercise || []);
    setIsLoadingInitial(false);
  }, [nutritionStorageKey, exerciseStorageKey]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs, currentDateKey]);

  useEffect(() => {
    if (dateKey) {
      setCurrentDateKey(dateKey);
    } else {
      setCurrentDateKey(getCurrentDateKey());
    }
  }, [dateKey]);

  const addNutritionEntry = async (entryData: { foodName: string; portionSize: string }) => {
    setIsEstimating(true);
    try {
      const aiInput: EstimateFoodCaloriesInput = {
        foodName: entryData.foodName,
        portionSize: entryData.portionSize,
      };
      const aiResponse = await estimateFoodCalories(aiInput);
      
      const newEntry: NutritionEntry = {
        id: crypto.randomUUID(),
        foodName: entryData.foodName,
        portionSize: entryData.portionSize,
        calories: aiResponse.estimatedCalories,
        timestamp: Date.now(),
        aiNotes: aiResponse.estimationNotes,
      };
      const updatedLog = [...nutritionLog, newEntry];
      setNutritionLog(updatedLog);
      setItem(nutritionStorageKey, updatedLog);

      toast({
        title: "Nutrition Logged",
        description: `${newEntry.foodName} (${newEntry.portionSize}) added with an estimated ${newEntry.calories} kcal. ${newEntry.aiNotes ? `Note: ${newEntry.aiNotes}` : ''}`,
      });

    } catch (error) {
      console.error("Error estimating calories or saving entry:", error);
      toast({
        title: "Estimation Failed",
        description: "Could not estimate calories for your entry. Please try again or check the food details.",
        variant: "destructive",
      });
      throw error; 
    } finally {
      setIsEstimating(false);
    }
  };

  const addExerciseEntry = (entry: Omit<ExerciseEntry, 'id' | 'timestamp'>) => {
    const newEntry: ExerciseEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    const updatedLog = [...exerciseLog, newEntry];
    setExerciseLog(updatedLog);
    setItem(exerciseStorageKey, updatedLog);
     toast({ 
      title: "Exercise Logged",
      description: `${newEntry.exerciseName} has been added to your log.`,
    });
  };
  
  const removeNutritionEntry = (id: string) => {
    const updatedLog = nutritionLog.filter(entry => entry.id !== id);
    setNutritionLog(updatedLog);
    setItem(nutritionStorageKey, updatedLog);
  };

  const removeExerciseEntry = (id: string) => {
    const updatedLog = exerciseLog.filter(entry => entry.id !== id);
    setExerciseLog(updatedLog);
    setItem(exerciseStorageKey, updatedLog);
  };


  const totalCaloriesConsumed = nutritionLog.reduce((sum, entry) => sum + entry.calories, 0);
  const totalCaloriesBurned = exerciseLog.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

  return {
    nutritionLog,
    exerciseLog,
    addNutritionEntry,
    addExerciseEntry,
    removeNutritionEntry,
    removeExerciseEntry,
    totalCaloriesConsumed,
    totalCaloriesBurned,
    netCalories,
    isLoading: isLoadingInitial || isEstimating, 
    currentDateKey,
    reloadLogs: loadLogs,
  };
}
