
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, DollarSign, User, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Manage your profile and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Update your personal information, password, and other account-related settings.
            </p>
            <Button variant="outline" className="w-full shadow-md hover:shadow-lg transition-shadow" disabled>
                Manage Account (Coming Soon)
                <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure how you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Choose which notifications you want to receive and how you want to receive them (e.g., email, in-app).
            </p>
             <Button variant="outline" className="w-full shadow-md hover:shadow-lg transition-shadow" disabled>
                Configure Notifications (Coming Soon)
                <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

         <Card className="shadow-lg">
           <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Service & Pricing
            </CardTitle>
            <CardDescription>Manage service types and their pricing.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Define the types of laundry services offered and set their respective prices (per kg or per item).
            </p>
            <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
              <Link href="/service-types">
                Manage Service Types
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
