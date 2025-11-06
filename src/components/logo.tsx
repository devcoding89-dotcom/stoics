import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  const logoUrl = `https://storage.googleapis.com/stedi-assets/logos/stoics-logo-final-v3.png`;
  return (
    <Image
      src={logoUrl}
      alt="Stoics Educational Institute & Services Logo"
      className={cn('h-10 w-auto', className)}
      width={1080}
      height={1080}
      aria-hidden="true"
      unoptimized
    />
  );
}
