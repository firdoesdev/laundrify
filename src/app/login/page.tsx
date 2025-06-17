
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Package, Mail, KeyRound } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder login logic
    console.log("Login attempt");
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Package className="h-12 w-12 mx-auto text-primary" />
          </Link>
          <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Log in to your Laundrify Dashboard account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="h-11 text-base"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/>Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required className="h-11 text-base"/>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-shadow">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-center">
            <Link href="#" className="text-sm text-primary hover:underline">
                Forgot your password?
            </Link>
            <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
            </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
