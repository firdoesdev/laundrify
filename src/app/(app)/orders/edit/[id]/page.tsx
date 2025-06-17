
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import type { Order, Customer, OrderStatus, ServiceType } from '@/types';
import { DEFAULT_PRICE_PER_KG, PERFUME_OPTIONS, sampleOrders, sampleCustomers, sampleServiceTypes } from '@/lib/data';
import { CalendarIcon, Save, User, Tag, Weight, Sparkles, Info, DollarSign, Loader2, Users, ArrowLeft, AlertTriangle, CheckCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const orderFormSchema = z.object({
  customerId: z.string().min(1, { message: "Customer ID is required." }),
  // customerName is derived
  serviceType: z.string().min(1, { message: "Service type is required." }),
  weightInKg: z.coerce.number().min(0.1, { message: "Weight must be at least 0.1 kg." }),
  perfume: z.string({ required_error: "Please select a perfume." }),
  status: z.enum(['Pending', 'Processing', 'Completed', 'Cancelled'], { required_error: "Please select a status." }),
  dueDate: z.date().optional(),
  orderDate: z.date({ required_error: "Order date is required."}), 
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const LOCAL_STORAGE_PRICE_KEY = 'laundryPricePerKg';

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [pricePerKg, setPricePerKg] = useState<number>(DEFAULT_PRICE_PER_KG);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOrder, setIsFetchingOrder] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [originalOrder, setOriginalOrder] = useState<Order | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: '',
      serviceType: '',
      weightInKg: 0,
      perfume: '',
      status: 'Pending',
      dueDate: undefined,
      orderDate: new Date(),
    },
  });

  useEffect(() => {
    const storedPrice = localStorage.getItem(LOCAL_STORAGE_PRICE_KEY);
    if (storedPrice) {
      setPricePerKg(parseFloat(storedPrice));
    }
    setCustomers(sampleCustomers);
    setServiceTypes(sampleServiceTypes);

    if (orderId) {
      const foundOrder = sampleOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOriginalOrder(foundOrder);
        form.reset({
          customerId: foundOrder.customerId,
          serviceType: foundOrder.serviceType,
          weightInKg: foundOrder.weightInKg || 0,
          perfume: foundOrder.perfume || '',
          status: foundOrder.status,
          dueDate: foundOrder.dueDate ? parseISO(foundOrder.dueDate) : undefined,
          orderDate: foundOrder.orderDate ? parseISO(foundOrder.orderDate) : new Date(),
        });
        setCalculatedTotal(foundOrder.totalAmount); 
      }
      setIsFetchingOrder(false);
    }
  }, [orderId, form]);

  const weightInKgValue = form.watch('weightInKg');

  useEffect(() => {
    if (typeof weightInKgValue === 'number' && pricePerKg > 0) {
      setCalculatedTotal(weightInKgValue * pricePerKg);
    } else if (originalOrder) { 
      setCalculatedTotal(originalOrder.totalAmount);
    } else {
      setCalculatedTotal(0);
    }
  }, [weightInKgValue, pricePerKg, originalOrder]);

  const onSubmit: SubmitHandler<OrderFormValues> = (data) => {
    setIsLoading(true);
    const orderIndex = sampleOrders.findIndex(o => o.id === orderId);
    const selectedCustomer = customers.find(c => c.id === data.customerId);

    if (orderIndex > -1 && selectedCustomer) {
      const updatedOrder: Order = {
        ...sampleOrders[orderIndex], 
        customerId: data.customerId,
        customerName: selectedCustomer.name, // Get name from selected customer
        serviceType: data.serviceType,
        weightInKg: data.weightInKg,
        perfume: data.perfume,
        status: data.status,
        orderDate: format(data.orderDate, 'yyyy-MM-dd'), 
        dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
        totalAmount: calculatedTotal, 
      };
      sampleOrders[orderIndex] = updatedOrder;

      toast({
        title: 'Order Updated Successfully!',
        description: `Order ID: ${updatedOrder.id} has been updated.`,
      });
      setIsLoading(false);
      router.push(`/orders/${orderId}`); 
      router.refresh();
    } else {
      toast({
        title: 'Error Updating Order',
        description: 'Order not found or customer invalid.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  if (isFetchingOrder) {
    return <div className="flex justify-center items-center h-64">Loading order data...</div>;
  }

  if (!originalOrder && !isFetchingOrder) {
     return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order with ID "{orderId}" could not be found for editing.</p>
        <Button asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Edit Order: {orderId}</h1>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Users className="h-6 w-6 text-primary" /> Customer & Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value} 
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.map(st => (
                          <SelectItem key={st.id} value={st.name}>{st.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select order status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['Pending', 'Processing', 'Completed', 'Cancelled'] as OrderStatus[]).map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Order Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal h-11", !field.value && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: dateFnsLocaleId }) : <span>Pilih tanggal order</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
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
                            className={cn("w-full justify-start text-left font-normal h-11",!field.value && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: dateFnsLocaleId }) : <span>Pilih tanggal selesai</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <span>Current price per kg: <strong>Rp {pricePerKg.toLocaleString('id-ID')}</strong>. You can change this in <Link href="/settings/pricing" className="underline text-primary">Pricing Settings</Link>.</span>
                </div>
                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <DollarSign className="h-7 w-7 text-green-600" />
                    Estimated Total: <span className="text-primary">Rp {calculatedTotal.toLocaleString('id-ID')}</span>
                </div>
            </CardFooter>
          </Card>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
