"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/types";
import { USER_PROFILE_KEY } from "@/lib/constants";
import { getItem } from "@/lib/localStorage";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { AISuggestions } from "@/components/AISuggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, TrendingUp, TrendingDown, Activity, Apple, Scale, Info } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const {
    totalCaloriesConsumed,
    totalCaloriesBurned,
    netCalories,
    isLoading: isLoadingLogs,
  } = useDailyLogs();

  useEffect(() => {
    const profileData = getItem<UserProfile>(USER_PROFILE_KEY);
    if (!profileData) {
      router.replace("/profile");
    } else {
      setUserProfile(profileData);
    }
    setIsLoadingProfile(false);
  }, [router]);

  if (isLoadingProfile || !userProfile) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  // Example target calories - this could be dynamic based on goal
  const targetCalories = userProfile.goal === "Lose Fat" ? (userProfile.weight * 22) - 500 
                        : userProfile.goal === "Gain Muscle" ? (userProfile.weight * 33) + 300 
                        : (userProfile.weight * 28); // Maintain
  
  const caloriesProgress = targetCalories > 0 ? Math.min((totalCaloriesConsumed / targetCalories) * 100, 100) : 0;


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, Fitness Buddy!</h1>
        <p className="text-lg text-muted-foreground">Here's your daily fitness snapshot.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Goal</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile.goal}</div>
            <p className="text-xs text-muted-foreground">Current Weight: {userProfile.weight} kg</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Consumed</CardTitle>
            <Apple className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCaloriesConsumed} kcal</div>
             <p className="text-xs text-muted-foreground">Target: {targetCalories.toFixed(0)} kcal</p>
            <Progress value={caloriesProgress} className="mt-2 h-2" />

          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCaloriesBurned} kcal</div>
            <p className="text-xs text-muted-foreground">From logged exercises</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Calories</CardTitle>
            {netCalories >= 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCalories >=0 && (totalCaloriesConsumed > targetCalories && userProfile.goal !== "Gain Muscle") ? 'text-red-500' : netCalories >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {netCalories} kcal
            </div>
            <p className="text-xs text-muted-foreground">Consumed - Burned</p>
          </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BMI</CardTitle>
            <Scale className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile.bmi}</div>
            <p className="text-xs text-muted-foreground">
              {userProfile.bmi < 18.5 ? "Underweight" : userProfile.bmi < 25 ? "Normal" : userProfile.bmi < 30 ? "Overweight" : "Obese"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {isLoadingLogs ? (
         <Skeleton className="h-48 rounded-lg" />
      ) : (
        <AISuggestions
          userProfile={userProfile}
          caloriesConsumed={totalCaloriesConsumed}
          caloriesBurned={totalCaloriesBurned}
          netCalories={netCalories}
        />
      )}
      
      <Card className="bg-accent/50 border-accent shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-accent-foreground" />
            Did you know?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-accent-foreground">
            You can manage your profile, log meals, and track exercises using the navigation menu. Stay consistent to achieve your fitness goals!
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
