import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('h-10 w-auto', className)}></div>
  );
}
