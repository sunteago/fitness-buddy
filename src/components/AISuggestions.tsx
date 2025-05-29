
"use client";

import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { personalizedFitnessSuggestions, type PersonalizedFitnessSuggestionsInput, type PersonalizedFitnessSuggestionsOutput } from '@/ai/flows/personalized-fitness-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AISuggestionsProps {
  userProfile: UserProfile | null;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
}

export function AISuggestions({ userProfile, caloriesConsumed, caloriesBurned, netCalories }: AISuggestionsProps) {
  const [suggestion, setSuggestion] = useState<PersonalizedFitnessSuggestionsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      const fetchSuggestion = async () => {
        setLoading(true);
        setError(null);
        try {
          const input: PersonalizedFitnessSuggestionsInput = {
            age: userProfile.age,
            gender: userProfile.gender,
            height: userProfile.height,
            weight: userProfile.weight,
            goal: userProfile.goal,
            caloriesConsumed,
            caloriesBurned,
            netCalories,
            bmi: userProfile.bmi,
            dietaryPreference: userProfile.dietaryPreference,
          };
          const result = await personalizedFitnessSuggestions(input);
          setSuggestion(result);
        } catch (err) {
          console.error("Error fetching AI suggestion:", err);
          setError("Failed to load personalized suggestions. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchSuggestion();
    }
  }, [userProfile, caloriesConsumed, caloriesBurned, netCalories]);

  if (!userProfile) {
    return null; // Or a message indicating profile is needed
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="text-primary h-6 w-6" />
          AI Powered Suggestions
        </CardTitle>
        <CardDescription>Personalized tips based on your daily progress and goals.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Generating suggestions...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {suggestion && !loading && !error && (
           <Alert 
             variant={suggestion.isGood ? "default" : "destructive"}
             className={cn(
                !suggestion.isGood && "dark:text-[hsl(var(--destructive-foreground))] dark:[&>svg]:text-[hsl(var(--destructive-foreground))]"
             )}
           >
             <AlertTitle>
               {suggestion.isGood ? "Great Progress!" : "Friendly Advice"}
             </AlertTitle>
             <AlertDescription>
               {suggestion.suggestion}
             </AlertDescription>
           </Alert>
        )}
      </CardContent>
    </Card>
  );
}
