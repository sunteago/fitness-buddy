"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ExerciseEntry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const exerciseFormSchema = z.object({
  exerciseName: z.string().min(1, "Exercise name is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  caloriesBurned: z.coerce.number().min(0, "Calories burned must be non-negative"),
});

type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;

interface ExerciseLogFormProps {
  onAddEntry: (entry: Omit<ExerciseEntry, 'id' | 'timestamp'>) => void;
}

export function ExerciseLogForm({ onAddEntry }: ExerciseLogFormProps) {
  const { toast } = useToast();
  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      exerciseName: "",
      duration: undefined,
      caloriesBurned: undefined,
    },
  });

  function onSubmit(data: ExerciseFormValues) {
    onAddEntry(data);
    form.reset();
    toast({
      title: "Exercise Logged",
      description: `${data.exerciseName} has been added to your log.`,
    });
  }

  return (
    <Card className="w-full max-w-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Log Your Workout</CardTitle>
        <CardDescription>Enter the details of your exercise session.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="exerciseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Running, Weightlifting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caloriesBurned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories Burned (kcal)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Workout</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
