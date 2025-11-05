import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return <GraduationCap className={cn('h-6 w-6 text-primary', className)} />;
}
