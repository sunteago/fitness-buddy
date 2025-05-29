"use client";

import type { ExerciseEntry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';

interface ExerciseListProps {
  entries: ExerciseEntry[];
  onRemoveEntry: (id: string) => void;
}

export function ExerciseList({ entries, onRemoveEntry }: ExerciseListProps) {
  if (entries.length === 0) {
    return (
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle>Today's Exercise Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No workouts logged for today yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle>Today's Exercise Log</CardTitle>
        <CardDescription>Overview of your logged workouts for today.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exercise Name</TableHead>
              <TableHead className="text-right">Duration (min)</TableHead>
              <TableHead className="text-right">Calories Burned (kcal)</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.exerciseName}</TableCell>
                <TableCell className="text-right">{entry.duration}</TableCell>
                <TableCell className="text-right">{entry.caloriesBurned}</TableCell>
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
      </CardContent>
    </Card>
  );
}
