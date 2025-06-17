
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea'; // If needed for notes
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';
import { DEFAULT_PRICE_PER_KG, PERFUME_OPTIONS, sampleOrders } from '@/lib/data'; // Assuming sampleOrders is used for temporary storage
import { CalendarIcon, PlusCircle, User, Tag, Weight, Sparkles, Info, DollarSign, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const orderFormSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name must be at least 2 characters." }),
  customerId: z.string().min(2, { message: "Customer ID must be at least 2 characters." }).optional().or(z.literal('')), // Optional for now
  serviceType: z.string().min(3, { message: "Service type must be at least 3 characters." }),
  weightInKg: z.coerce.number().min(0.1, { message: "Weight must be at least 0.1 kg." }),
  perfume: z.string({ required_error: "Please select a perfume." }),
  dueDate: z.date().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const LOCAL_STORAGE_PRICE_KEY = 'laundryPricePerKg';

export default function CreateOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pricePerKg, setPricePerKg] = useState<number>(DEFAULT_PRICE_PER_KG);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedPrice = localStorage.getItem(LOCAL_STORAGE_PRICE_KEY);
    if (storedPrice) {
      setPricePerKg(parseFloat(storedPrice));
    }
  }, []);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerId: '',
      serviceType: 'Regular Kilogram',
      weightInKg: 0,
      perfume: '',
      dueDate: undefined,
    },
  });

  const weightInKgValue = form.watch('weightInKg');

  useEffect(() => {
    if (typeof weightInKgValue === 'number' && pricePerKg > 0) {
      setCalculatedTotal(weightInKgValue * pricePerKg);
    } else {
      setCalculatedTotal(0);
    }
  }, [weightInKgValue, pricePerKg]);

  const onSubmit: SubmitHandler<OrderFormValues> = (data) => {
    setIsLoading(true);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`, // Simple ID generation
      customerName: data.customerName,
      customerId: data.customerId || `CUST-${Date.now()}`, // Generate if empty
      serviceType: data.serviceType,
      weightInKg: data.weightInKg,
      perfume: data.perfume,
      status: 'Pending',
      orderDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
      totalAmount: calculatedTotal,
    };

    // In a real app, you would send this to a backend.
    // For now, we can log it and add to a temporary list or just show a success toast.
    console.log('New Order Submitted:', newOrder);
    
    // This is a temporary way to "store" the order for the demo.
    // In a real app, this would be an API call.
    // For this prototype, let's assume sampleOrders isn't directly mutable this way
    // and rely on the toast and redirect.
    // sampleOrders.unshift(newOrder); // This won't reflect globally without state management

    toast({
      title: 'Order Created Successfully!',
      description: `Order ID: ${newOrder.id} for ${newOrder.customerName} has been created. Total: Rp ${newOrder.totalAmount.toLocaleString('id-ID')}`,
    });
    setIsLoading(false);
    router.push('/orders');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Create New Laundry Order</h1>
        <Button variant="outline" onClick={() => router.back()}>Back to Orders</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <User className="h-6 w-6 text-primary" /> Customer & Service Details
              </CardTitle>
              <CardDescription>Enter customer information and the type of service requested.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Budi Santoso" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CUST123" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Regular Kilogram, Express" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: dateFnsLocaleId })
                            ) : (
                              <span>Pilih tanggal selesai</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Weight className="h-6 w-6 text-primary" /> Laundry Details & Pricing
              </CardTitle>
              <CardDescription>Enter laundry weight and choose perfume. Total price will be calculated automatically.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="weightInKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2.5" {...field} step="0.1" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="perfume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfume Selection</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a perfume" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PERFUME_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-5 w-5 text-primary" />
                    <span>Current price per kg: <strong>Rp {pricePerKg.toLocaleString('id-ID')}</strong>. You can change this in <a href="/settings/pricing" className="underline text-primary">Pricing Settings</a>.</span>
                </div>
                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <DollarSign className="h-7 w-7 text-green-600" />
                    Estimated Total: <span className="text-primary">Rp {calculatedTotal.toLocaleString('id-ID')}</span>
                </div>
            </CardFooter>
          </Card>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
              Create Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
