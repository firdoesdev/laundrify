
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, DollarSign } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <DollarSign className="h-6 w-6 text-primary" />
              Pricing Management
            </CardTitle>
            <CardDescription>
              Configure pricing for your laundry services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Set the price per kilogram for standard laundry services. This price will be used to automatically calculate order totals.
            </p>
            <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
              <Link href="/settings/pricing">
                Set Price per Kilogram
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for other settings cards */}
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle className="font-headline text-xl">Account Settings</CardTitle>
            <CardDescription>Manage your profile and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle className="font-headline text-xl">Notification Settings</CardTitle>
            <CardDescription>Configure how you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
