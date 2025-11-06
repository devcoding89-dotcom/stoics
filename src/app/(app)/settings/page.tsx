'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { customizeAITutorPersonality } from '@/ai/flows/customize-ai-tutor-personality';
import { Input } from '@/components/ui/input';


function AiPersonalityCustomizer() {
  const { toast } = useToast();
  const [instructions, setInstructions] = React.useState(
    'You should be encouraging and use simple language. When a student gets an answer wrong, gently guide them to the correct answer without giving it away directly. Use emojis to make the interaction friendly.'
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await customizeAITutorPersonality({ teacherInstructions: instructions });
      toast({
        title: 'Success!',
        description: result.confirmationMessage,
        variant: 'default',
        className: 'bg-accent text-accent-foreground'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update AI personality. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Tutor Personality</CardTitle>
        <CardDescription>Provide instructions on how the AI tutor should communicate with students.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="instructions">Communication Style & Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="e.g., Be encouraging, use simple terms, add emojis..."
              rows={8}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Personality'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { userProfile, isUserProfileLoading } = useUser();
  
  if (isUserProfileLoading || !userProfile) {
    return null;
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and application settings."
      />
      <div className="grid gap-6">
        {userProfile?.role === 'teacher' && <AiPersonalityCustomizer />}

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
