import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  const logoUrl = `https://storage.googleapis.com/stedi-assets/logos/stoics-logo-final.png`;
  return (
    <Image
      src={logoUrl}
      alt="Stoics Educational Institute & Services Logo"
      className={cn('h-10 w-auto', className)}
      width={160}
      height={40}
      aria-hidden="true"
      unoptimized
    />
  );
}
