"use client";

import { ExerciseLogForm } from "@/components/ExerciseLogForm";
import { ExerciseList } from "@/components/ExerciseList";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExercisePage() {
  const { 
    exerciseLog, 
    addExerciseEntry, 
    removeExerciseEntry,
    totalCaloriesBurned, 
    isLoading 
  } = useDailyLogs();

  if (isLoading) {
    return (
       <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full max-w-lg" />
        <Skeleton className="h-10 w-1/4 mt-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Exercise Tracking</h1>
        <p className="text-muted-foreground">Log your workouts and monitor your calorie expenditure.</p>
      </div>
      
      <ExerciseLogForm onAddEntry={addExerciseEntry} />

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Daily Calorie Burn Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            Total Calories Burned: <span className="text-primary">{totalCaloriesBurned} kcal</span>
          </p>
        </CardContent>
      </Card>

      <ExerciseList entries={exerciseLog} onRemoveEntry={removeExerciseEntry} />
    </div>
  );
}
