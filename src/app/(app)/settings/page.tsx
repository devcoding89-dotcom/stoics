'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { userProfile, isUserLoading } = useUser();
  
  if (isUserLoading || !userProfile) {
    return null;
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and application settings."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={`${userProfile.firstName} ${userProfile.lastName}`} />
            </div>
             <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={userProfile.email} disabled />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
