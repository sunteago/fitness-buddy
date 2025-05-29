
"use client";

import * as React from "react";
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
import { useToast } from "@/hooks/use-toast";

// Updated schema: removed calories, changed portionSize to string
const nutritionFormSchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  portionSize: z.string().min(1, "Portion size is required (e.g., 100g, 1 cup, 1 medium)"),
});

// Updated form values type
type NutritionFormValues = z.infer<typeof nutritionFormSchema>;

interface NutritionLogFormProps {
  // onAddEntry now takes an object with foodName and portionSize
  onAddEntry: (entry: { foodName: string; portionSize: string }) => Promise<void>; // Make it async to handle AI call
}

export function NutritionLogForm({ onAddEntry }: NutritionLogFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false); // For loading state

  const form = useForm<NutritionFormValues>({
    resolver: zodResolver(nutritionFormSchema),
    defaultValues: {
      foodName: "",
      portionSize: "", // Default to empty string
    },
  });

  async function onSubmit(data: NutritionFormValues) {
    setIsSubmitting(true);
    try {
      await onAddEntry(data); // Await the AI estimation and saving
      form.reset();
      // Toast moved to useDailyLogs after successful AI estimation and saving
    } catch (error) {
      console.error("Error adding nutrition entry:", error);
      toast({
        title: "Error",
        description: "Could not estimate calories or save entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Log Your Meal</CardTitle>
        <CardDescription>Enter food and portion. We'll estimate the calories!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="foodName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Apple, Chicken Breast" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="portionSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portion Size</FormLabel>
                  <FormControl>
                    {/* Changed type to text */}
                    <Input type="text" placeholder="e.g., 1 medium, 100g, 1 cup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Calories field removed */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Estimating & Adding..." : "Add Meal"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
