
'use server';
/**
 * @fileOverview A Genkit flow to estimate calories for a given food item and portion size.
 *
 * - estimateFoodCalories - A function that estimates calories.
 * - EstimateFoodCaloriesInput - The input type for the estimateFoodCalories function.
 * - EstimateFoodCaloriesOutput - The return type for the estimateFoodCalories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateFoodCaloriesInputSchema = z.object({
  foodName: z.string().describe('The name of the food item.'),
  portionSize: z.string().describe('The portion size of the food item (e.g., "100g", "1 cup", "1 medium apple").'),
});
export type EstimateFoodCaloriesInput = z.infer<typeof EstimateFoodCaloriesInputSchema>;

const EstimateFoodCaloriesOutputSchema = z.object({
  estimatedCalories: z.number().describe('The estimated number of calories for the food item and portion size. This should be a numerical value only.'),
  estimationNotes: z.string().optional().describe('Any notes, disclaimers, or assumptions made during the estimation, especially if the portion size was ambiguous or if a common serving size was assumed. Example: "Estimated for a medium-sized apple."'),
});
export type EstimateFoodCaloriesOutput = z.infer<typeof EstimateFoodCaloriesOutputSchema>;

export async function estimateFoodCalories(input: EstimateFoodCaloriesInput): Promise<EstimateFoodCaloriesOutput> {
  return estimateFoodCaloriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateFoodCaloriesPrompt',
  input: {schema: EstimateFoodCaloriesInputSchema},
  output: {schema: EstimateFoodCaloriesOutputSchema},
  prompt: `You are a nutritional AI assistant. Your task is to estimate the caloric content of a given food item and its portion size.

Food Item: {{foodName}}
Portion Size: {{portionSize}}

Provide your best estimate for the calories.
- The 'estimatedCalories' field must be a number.
- If the portion size is ambiguous (e.g., "a piece", "some"), make a reasonable assumption based on common serving sizes and clearly state your assumption in the 'estimationNotes' field.
- If the food item is very generic (e.g., "cake"), try to assume a common type (e.g., "chocolate cake, 1 slice") and note this.
- If you are highly uncertain or cannot make a reasonable estimate, you can return 0 calories and explain why in the notes.
- Ensure 'estimationNotes' provides context if the input was vague. For example, if portionSize is "1 apple", note "Estimated for a medium-sized apple (approx. 182g)."

Example Output (Good portion size):
Input: { foodName: "Banana", portionSize: "1 medium (approx 118g)" }
Output: { "estimatedCalories": 105, "estimationNotes": "Estimated for a medium banana (approx 118g)." }

Example Output (Ambiguous portion size):
Input: { foodName: "Chicken Breast", portionSize: "1 piece" }
Output: { "estimatedCalories": 165, "estimationNotes": "Estimated for a standard serving of cooked chicken breast (approx 85g or 3 oz)." }

Example Output (Vague food item):
Input: { foodName: "Pasta", portionSize: "1 bowl" }
Output: { "estimatedCalories": 300, "estimationNotes": "Estimated for approximately 2 cups of cooked pasta. Type of pasta and sauce not specified, assumed plain cooked pasta." }
`,
});

const estimateFoodCaloriesFlow = ai.defineFlow(
  {
    name: 'estimateFoodCaloriesFlow',
    inputSchema: EstimateFoodCaloriesInputSchema,
    outputSchema: EstimateFoodCaloriesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
