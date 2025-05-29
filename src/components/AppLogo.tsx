import { Dumbbell } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2 text-xl font-bold text-sidebar-primary-foreground p-2">
      <Dumbbell className="h-7 w-7" />
      <span>Fitness Buddy</span>
    </div>
  );
}
