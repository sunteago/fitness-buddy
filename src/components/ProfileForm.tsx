
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { USER_PROFILE_KEY, GENDER_OPTIONS, GOAL_OPTIONS, DIETARY_PREFERENCE_OPTIONS } from "@/lib/constants";
import type { UserProfile, Gender, Goal, DietaryPreference } from "@/lib/types";
import { calculateBMI } from "@/lib/utils";
import { setItem } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  age: z.coerce.number().min(1, "Age must be positive").max(120, "Age seems too high"),
  gender: z.enum(GENDER_OPTIONS, { required_error: "Please select a gender." }),
  height: z.coerce.number().min(50, "Height must be at least 50cm").max(300, "Height seems too high"),
  weight: z.coerce.number().min(1, "Weight must be positive").max(500, "Weight seems too high"),
  goal: z.enum(GOAL_OPTIONS, { required_error: "Please select a goal." }),
  dietaryPreference: z.enum(DIETARY_PREFERENCE_OPTIONS).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  onProfileSaved: (profile: UserProfile) => void;
  initialData?: UserProfile;
}

export function ProfileForm({ onProfileSaved, initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData ? {
      age: initialData.age,
      gender: initialData.gender,
      height: initialData.height,
      weight: initialData.weight,
      goal: initialData.goal,
      dietaryPreference: initialData.dietaryPreference || "None",
    } : {
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      goal: undefined,
      dietaryPreference: "None",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    const bmi = calculateBMI(data.weight, data.height);
    const userProfile: UserProfile = { ...data, bmi, dietaryPreference: data.dietaryPreference || "None" };
    setItem(USER_PROFILE_KEY, userProfile);
    onProfileSaved(userProfile);
    toast({
      title: "Profile Saved",
      description: "Your profile has been successfully saved.",
    });
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{initialData ? "Update Profile" : "Create Your Profile"}</CardTitle>
        <CardDescription>
          {initialData ? "Update your details below." : "Let's get some basic information to personalize your experience."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your height in cm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your weight in kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Fitness Goal</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {GOAL_OPTIONS.map((goal) => (
                        <FormItem key={goal} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={goal} />
                          </FormControl>
                          <FormLabel className="font-normal">{goal}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "None"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your dietary preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DIETARY_PREFERENCE_OPTIONS.map((preference) => (
                        <SelectItem key={preference} value={preference}>
                          {preference}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {initialData ? "Update Profile" : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
