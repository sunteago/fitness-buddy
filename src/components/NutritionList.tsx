
"use client";

import type { NutritionEntry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Info } from "lucide-react";
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NutritionListProps {
  entries: NutritionEntry[];
  onRemoveEntry: (id: string) => void;
}

export function NutritionList({ entries, onRemoveEntry }: NutritionListProps) {
  if (entries.length === 0) {
    return (
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle>Today's Nutrition Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No meals logged for today yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle>Today's Nutrition Log</CardTitle>
        <CardDescription>Overview of your logged meals for today. Calories are estimated by AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Name</TableHead>
                <TableHead>Portion</TableHead>
                <TableHead className="text-right">Est. Calories (kcal)</TableHead>
                <TableHead className="text-right">Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{entry.foodName}</span>
                      {entry.aiNotes && (
                         <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 p-0">
                               <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs bg-popover text-popover-foreground p-2 rounded shadow-md border">
                            <p className="text-sm">{entry.aiNotes}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{entry.portionSize}</TableCell>
                  <TableCell className="text-right">{entry.calories}</TableCell>
                  <TableCell className="text-right">{format(new Date(entry.timestamp), 'HH:mm')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onRemoveEntry(entry.id)} aria-label="Remove entry">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
