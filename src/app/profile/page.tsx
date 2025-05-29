"use client";

import { useState, useEffect } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { ProfileSummary } from "@/components/ProfileSummary";
import type { UserProfile } from "@/lib/types";
import { USER_PROFILE_KEY } from "@/lib/constants";
import { getItem } from "@/lib/localStorage";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileData = getItem<UserProfile>(USER_PROFILE_KEY);
    if (profileData) {
      setUserProfile(profileData);
      setEditing(false);
    } else {
      setEditing(true); // If no profile, start in editing mode
    }
    setLoading(false);
  }, []);

  const handleProfileSaved = (profile: UserProfile) => {
    setUserProfile(profile);
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full max-w-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {editing || !userProfile ? (
        <ProfileForm onProfileSaved={handleProfileSaved} initialData={userProfile || undefined} />
      ) : (
        <ProfileSummary profile={userProfile} onEdit={handleEdit} />
      )}
    </div>
  );
}
