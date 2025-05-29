
"use client";

import type { UserProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

interface ProfileSummaryProps {
  profile: UserProfile;
  onEdit: () => void;
}

export function ProfileSummary({ profile, onEdit }: ProfileSummaryProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>A summary of your current fitness profile.</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={onEdit} aria-label="Edit Profile">
          <Edit3 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Age</p>
            <p className="text-lg">{profile.age} years</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Gender</p>
            <p className="text-lg">{profile.gender}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Height</p>
            <p className="text-lg">{profile.height} cm</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Weight</p>
            <p className="text-lg">{profile.weight} kg</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">BMI</p>
            <p className="text-lg">{profile.bmi}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Goal</p>
            <p className="text-lg">{profile.goal}</p>
          </div>
          {profile.dietaryPreference && profile.dietaryPreference !== "None" && (
            <div className="col-span-2">
              <p className="font-medium text-muted-foreground">Dietary Preference</p>
              <p className="text-lg">{profile.dietaryPreference}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
