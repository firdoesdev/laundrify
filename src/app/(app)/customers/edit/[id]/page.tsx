
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { Customer } from '@/types';
import { sampleCustomers } from '@/lib/data';
import { Save, User, Mail, Phone, MapPin, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const customerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(5, { message: "Phone number must be at least 5 digits." }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  // joinDate and totalOrders are not typically editable directly in this form
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const customerId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(true);
  const [originalCustomer, setOriginalCustomer] = useState<Customer | null>(null);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  useEffect(() => {
    if (customerId) {
      const foundCustomer = sampleCustomers.find(c => c.id === customerId);
      if (foundCustomer) {
        setOriginalCustomer(foundCustomer);
        form.reset({
          name: foundCustomer.name,
          phone: foundCustomer.phone,
          email: foundCustomer.email || '',
          address: foundCustomer.address || '',
        });
      }
      setIsFetchingCustomer(false);
    }
  }, [customerId, form]);

  const onSubmit: SubmitHandler<CustomerFormValues> = (data) => {
    setIsLoading(true);
    const customerIndex = sampleCustomers.findIndex(c => c.id === customerId);

    if (customerIndex > -1 && originalCustomer) {
      const updatedCustomer: Customer = {
        ...originalCustomer, // Preserve non-form fields like joinDate, totalOrders, id
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
        // lastOrderDate might be updated by order system, not here
      };
      sampleCustomers[customerIndex] = updatedCustomer;

      toast({
        title: 'Customer Updated Successfully!',
        description: `Customer ${updatedCustomer.name} (ID: ${updatedCustomer.id}) has been updated.`,
      });
      setIsLoading(false);
      router.push(`/customers/${customerId}`); // Redirect to detail page
      router.refresh();
    } else {
      toast({
        title: 'Error Updating Customer',
        description: 'Customer not found.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  if (isFetchingCustomer) {
    return <div className="flex justify-center items-center h-64">Loading customer data...</div>;
  }

  if (!originalCustomer && !isFetchingCustomer) {
     return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground mb-6">The customer with ID "{customerId}" could not be found for editing.</p>
        <Button asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Edit Customer: {originalCustomer?.name}</h1>
         <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <User className="h-6 w-6 text-primary" /> Customer Information
              </CardTitle>
              <CardDescription>Update the customer's details.</CardDescription>
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
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                Save Changes
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
