
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { Customer } from '@/types';
import { sampleCustomers } from '@/lib/data';
import { PlusCircle, User, Mail, Phone, MapPin, ArrowLeft, Loader2 } from 'lucide-react';

const customerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(5, { message: "Phone number must be at least 5 digits." }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function AddCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  const onSubmit: SubmitHandler<CustomerFormValues> = (data) => {
    setIsLoading(true);
    const newCustomer: Customer = {
      id: `CUST-${Date.now()}`, // Simple ID generation
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      address: data.address || undefined,
      joinDate: format(new Date(), 'yyyy-MM-dd'),
      totalOrders: 0,
      // avatarUrl will use default in table
    };

    sampleCustomers.unshift(newCustomer); // Add to the beginning of the global array

    toast({
      title: 'Customer Added Successfully!',
      description: `Customer ${newCustomer.name} (ID: ${newCustomer.id}) has been added.`,
    });
    setIsLoading(false);
    router.push('/customers');
    router.refresh(); // To attempt to reload data on the target page
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Add New Customer</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <User className="h-6 w-6 text-primary" /> Customer Information
              </CardTitle>
              <CardDescription>Enter the details for the new customer.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Budi Santoso" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g., 08123456789" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., budi@example.com" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jl. Mawar No. 10, Jakarta" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
             <CardFooter className="flex justify-end pt-6 border-t">
                <Button type="submit" size="lg" className="text-base shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                Add Customer
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
