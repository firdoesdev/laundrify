
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, User, Mail, KeyRound } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder signup logic
    console.log("Signup attempt");
    router.push('/dashboard'); // Redirect to dashboard after "signup"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Package className="h-12 w-12 mx-auto text-primary" />
          </Link>
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join Laundrify and manage your business efficiently.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Full Name</Label>
              <Input id="fullName" type="text" placeholder="John Doe" required className="h-11 text-base"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="h-11 text-base"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/>Password</Label>
              <Input id="password" type="password" placeholder="Choose a strong password" required className="h-11 text-base"/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/>Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Re-enter your password" required className="h-11 text-base"/>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-shadow">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
