'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is a placeholder. In the demo mode, we redirect directly to the dashboard.
export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  return null;
}
