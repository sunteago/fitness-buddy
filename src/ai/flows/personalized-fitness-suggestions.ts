
// src/ai/flows/personalized-fitness-suggestions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized fitness suggestions
 * based on user's logged data and fitness goals.
 *
 * - personalizedFitnessSuggestions - A function that takes user data and goals to provide personalized suggestions.
 * - PersonalizedFitnessSuggestionsInput - The input type for the personalizedFitnessSuggestions function.
 * - PersonalizedFitnessSuggestionsOutput - The return type for the personalizedFitnessSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {DIETARY_PREFERENCE_OPTIONS} from '@/lib/constants';
import {z} from 'genkit';

const PersonalizedFitnessSuggestionsInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  gender: z.enum(['Male', 'Female', 'Other']).describe('The gender of the user.'),
  height: z.number().describe('The height of the user in cm.'),
  weight: z.number().describe('The weight of the user in kg.'),
  goal: z.enum(['Lose Fat', 'Gain Muscle', 'Maintain']).describe('The fitness goal of the user.'),
  caloriesConsumed: z.number().describe('The total calories consumed by the user today.'),
  caloriesBurned: z.number().describe('The total calories burned by the user today.'),
  netCalories: z.number().describe('The net calorie balance for the user today (consumed - burned).'),
  bmi: z.number().describe('The Body Mass Index of the user.'),
  dietaryPreference: z.enum(DIETARY_PREFERENCE_OPTIONS).optional().describe('The dietary preference of the user (e.g., Vegan, Keto).'),
});

export type PersonalizedFitnessSuggestionsInput = z.infer<
  typeof PersonalizedFitnessSuggestionsInputSchema
>;

const PersonalizedFitnessSuggestionsOutputSchema = z.object({
  suggestion: z.string().describe('Personalized suggestion for calorie adjustments or exercises.'),
  isGood: z.boolean().describe('Whether the user is on track to reach their goals.'),
});

export type PersonalizedFitnessSuggestionsOutput = z.infer<
  typeof PersonalizedFitnessSuggestionsOutputSchema
>;

export async function personalizedFitnessSuggestions(
  input: PersonalizedFitnessSuggestionsInput
): Promise<PersonalizedFitnessSuggestionsOutput> {
  return personalizedFitnessSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFitnessSuggestionsPrompt',
  input: {schema: PersonalizedFitnessSuggestionsInputSchema},
  output: {schema: PersonalizedFitnessSuggestionsOutputSchema},
  prompt: `You are a personal fitness assistant. Based on the user's profile and daily logs, provide a personalized suggestion to help them achieve their fitness goal.

  User Profile:
  - Age: {{age}}
  - Gender: {{gender}}
  - Height: {{height}} cm
  - Weight: {{weight}} kg
  - BMI: {{bmi}}
  - Fitness Goal: {{goal}}
  {{#if dietaryPreference}}- Dietary Preference: {{dietaryPreference}}{{/if}}

  Daily Logs:
  - Calories Consumed: {{caloriesConsumed}}
  - Calories Burned: {{caloriesBurned}}
  - Net Calories: {{netCalories}}

  Determine if the user is on track to reach their goal. If they are not, provide a specific suggestion for calorie adjustments or exercises. If they are on track, congratulate them and encourage them to keep going. Return isGood as true if the user is on track to reaching their goals, otherwise false.
  If a dietary preference is provided (and is not "None"), consider it subtly in your suggestions if relevant, but do not make it the primary focus unless directly tied to calorie/macro advice.

  Example output, IF the user is not on track to reaching their goals:
  {
    "suggestion": "Consider reducing your calorie intake by 200 kcal today to stay on track with your weight loss goal.",
    "isGood": false
  }

  Example output, IF the user is on track to reaching their goals:
  {
    "suggestion": "Great job staying on track with your fitness goals! Keep up the great work!",
    "isGood": true
  }
  `,
});

const personalizedFitnessSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedFitnessSuggestionsFlow',
    inputSchema: PersonalizedFitnessSuggestionsInputSchema,
    outputSchema: PersonalizedFitnessSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
