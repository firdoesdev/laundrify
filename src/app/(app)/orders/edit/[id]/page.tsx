
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import type { Order, Customer, OrderStatus, ServiceType as AppServiceType, PricingModel } from '@/types';
import { PERFUME_OPTIONS, sampleOrders, sampleCustomers, sampleServiceTypes } from '@/lib/data';
import { CalendarIcon, Save, Weight, Sparkles, DollarSign, Loader2, Users, ArrowLeft, AlertTriangle, PackageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const orderFormSchema = z.object({
  customerId: z.string().min(1, { message: "Customer ID is required." }),
  serviceTypeName: z.string().min(1, { message: "Service type is required." }),
  valueForCalculation: z.coerce.number().min(0.1, { message: "Value must be at least 0.1." }),
  perfume: z.string().optional(),
  status: z.enum(['Pending', 'Processing', 'Completed', 'Cancelled'], { required_error: "Please select a status." }),
  dueDate: z.date().optional(),
  orderDate: z.date({ required_error: "Order date is required." }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOrder, setIsFetchingOrder] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceTypes, setServiceTypes] = useState<AppServiceType[]>([]);
  const [originalOrder, setOriginalOrder] = useState<Order | null>(null);
  const [selectedServiceTypeDetail, setSelectedServiceTypeDetail] = useState<AppServiceType | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: '',
      serviceTypeName: '',
      valueForCalculation: 0,
      perfume: '',
      status: 'Pending',
      dueDate: undefined,
      orderDate: new Date(),
    },
  });

  useEffect(() => {
    setCustomers(sampleCustomers);
    setServiceTypes(sampleServiceTypes);

    if (orderId) {
      const foundOrder = sampleOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOriginalOrder(foundOrder);
        const serviceDetail = sampleServiceTypes.find(st => st.name === foundOrder.serviceType);
        setSelectedServiceTypeDetail(serviceDetail || null);

        form.reset({
          customerId: foundOrder.customerId,
          serviceTypeName: foundOrder.serviceType,
          valueForCalculation: serviceDetail?.pricingModel === 'per_kg' ? foundOrder.weightInKg || 0 : foundOrder.quantity || 0,
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

  const valueForCalculationWatch = form.watch('valueForCalculation');
  const serviceTypeNameWatch = form.watch('serviceTypeName');

  useEffect(() => {
    if (serviceTypeNameWatch) {
      const service = sampleServiceTypes.find(st => st.name === serviceTypeNameWatch);
      setSelectedServiceTypeDetail(service || null);
      if (service?.pricingModel === 'per_item' && form.getValues('perfume')) {
        form.setValue('perfume', undefined); 
      }
    } else {
      setSelectedServiceTypeDetail(null);
    }
  }, [serviceTypeNameWatch, form]);

  useEffect(() => {
    if (selectedServiceTypeDetail && typeof valueForCalculationWatch === 'number' && selectedServiceTypeDetail.price >= 0) {
      setCalculatedTotal(valueForCalculationWatch * selectedServiceTypeDetail.price);
    } else if (originalOrder && !selectedServiceTypeDetail) { // Case when service type might not be found but we have original total
        setCalculatedTotal(originalOrder.totalAmount);
    }
  }, [valueForCalculationWatch, selectedServiceTypeDetail, originalOrder]);


  const onSubmit: SubmitHandler<OrderFormValues> = (data) => {
    setIsLoading(true);
    const orderIndex = sampleOrders.findIndex(o => o.id === orderId);
    const selectedCustomer = customers.find(c => c.id === data.customerId);

    if (orderIndex > -1 && selectedCustomer && selectedServiceTypeDetail) {
      const updatedOrder: Order = {
        ...sampleOrders[orderIndex],
        customerId: data.customerId,
        customerName: selectedCustomer.name,
        serviceType: selectedServiceTypeDetail.name,
        status: data.status,
        orderDate: format(data.orderDate, 'yyyy-MM-dd'),
        dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
        totalAmount: calculatedTotal,
        weightInKg: selectedServiceTypeDetail.pricingModel === 'per_kg' ? data.valueForCalculation : undefined,
        quantity: selectedServiceTypeDetail.pricingModel === 'per_item' ? data.valueForCalculation : undefined,
        perfume: selectedServiceTypeDetail.pricingModel === 'per_kg' ? data.perfume : undefined,
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
        description: 'Order, customer, or service type details are invalid.',
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
  
  const valueInputLabel = selectedServiceTypeDetail?.pricingModel === 'per_kg' ? "Weight (kg)" : "Quantity";
  const valueInputIcon = selectedServiceTypeDetail?.pricingModel === 'per_kg' ? <Weight className="mr-2 h-4 w-4 text-muted-foreground"/> : <PackageIcon className="mr-2 h-4 w-4 text-muted-foreground"/>;


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
                name="serviceTypeName"
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
                          <SelectItem key={st.id} value={st.name}>{st.name} ({st.pricingModel === 'per_kg' ? 'Rp/kg' : 'Rp/item'})</SelectItem>
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
                            className={cn("w-full justify-start text-left font-normal h-11", !field.value && "text-muted-foreground")}
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
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {selectedServiceTypeDetail && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                   {selectedServiceTypeDetail.pricingModel === 'per_kg' ? 
                    <Weight className="h-6 w-6 text-primary" /> : 
                    <PackageIcon className="h-6 w-6 text-primary" />
                  }
                   Laundry Details & Pricing
                </CardTitle>
                <CardDescription>
                  Price for {selectedServiceTypeDetail.name}: Rp {selectedServiceTypeDetail.price.toLocaleString('id-ID')} / {selectedServiceTypeDetail.pricingModel === 'per_kg' ? 'kg' : 'item'}.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="valueForCalculation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">{valueInputIcon} {valueInputLabel}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={selectedServiceTypeDetail.pricingModel === 'per_kg' ? "e.g., 2.5" : "e.g., 1"} {...field} step="0.1" className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedServiceTypeDetail.pricingModel === 'per_kg' && (
                  <FormField
                    control={form.control}
                    name="perfume"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="flex items-center"><Sparkles className="mr-2 h-4 w-4 text-muted-foreground"/>Perfume Selection</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
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
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4 pt-6 border-t">
                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-7 w-7 text-green-600" />
                  Estimated Total: <span className="text-primary">Rp {calculatedTotal.toLocaleString('id-ID')}</span>
                </div>
              </CardFooter>
            </Card>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base shadow-md hover:shadow-lg transition-shadow" disabled={isLoading || !selectedServiceTypeDetail}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
