"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import type { Order, Customer, ServiceType, PricingModel } from '@/types';
import { PERFUME_OPTIONS, sampleOrders, sampleCustomers, sampleServiceTypes } from '@/lib/data';
import { CalendarIcon, PlusCircle, Weight, Sparkles, DollarSign, Loader2, Users, ArrowLeft, ClipboardList, PackageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import { useServiceTypes } from '@/hooks/useServiceTypes';

const orderFormSchema = z.object({
  customerId: z.string().min(1, { message: "Please select a customer." }),
  serviceTypeName: z.string().min(1, { message: "Please select a service type." }),
  valueForCalculation: z.coerce.number().min(0.1, { message: "Value must be at least 0.1." }),
  perfume: z.string().optional(),
  dueDate: z.date().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function CreateOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const { createOrder, isLoading: isCreatingOrder } = useOrders();
  const { data: serviceTypes = [], isLoading: isLoadingServiceTypes } = useServiceTypes();
  
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceTypeDetail, setSelectedServiceTypeDetail] = useState<ServiceType | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: '',
      serviceTypeName: '',
      valueForCalculation: 0,
      perfume: undefined,
      dueDate: undefined,
    },
  });

  const valueForCalculationWatch = form.watch('valueForCalculation');
  const serviceTypeNameWatch = form.watch('serviceTypeName');

  useEffect(() => {
    if (serviceTypeNameWatch) {
      const service = serviceTypes.find((st: any) => st.name === serviceTypeNameWatch);
      setSelectedServiceTypeDetail(service || null);
      if (service?.pricingModel === 'RUPIAH_PER_ITEM') {
        form.setValue('perfume', undefined); // Clear perfume if switching to per_item
      }
    } else {
      setSelectedServiceTypeDetail(null);
    }
  }, [serviceTypeNameWatch, form, serviceTypes]);

  useEffect(() => {
    if (selectedServiceTypeDetail && typeof valueForCalculationWatch === 'number' && selectedServiceTypeDetail.price > 0) {
      setCalculatedTotal(valueForCalculationWatch * selectedServiceTypeDetail.price);
    } else {
      setCalculatedTotal(0);
    }
  }, [valueForCalculationWatch, selectedServiceTypeDetail]);

  const valueInputLabel = selectedServiceTypeDetail?.pricingModel === 'RUPIAH_PER_KG' ? "Weight (kg)" : "Quantity";
  const valueInputIcon = selectedServiceTypeDetail?.pricingModel === 'RUPIAH_PER_KG' ? <Weight className="mr-2 h-4 w-4 text-muted-foreground"/> : <PackageIcon className="mr-2 h-4 w-4 text-muted-foreground"/>;

  // Show price per unit and estimated price reactively
  const pricePerUnit = selectedServiceTypeDetail?.price ?? 0;
  const estimatedPrice = valueForCalculationWatch && selectedServiceTypeDetail ? valueForCalculationWatch * pricePerUnit : 0;


  const onSubmit: SubmitHandler<OrderFormValues> = async (data) => {
    setIsLoading(true);
    const selectedCustomer = customers.find((c: Customer) => c.id === data.customerId);
    if (!selectedCustomer) {
      toast({ title: 'Error', description: 'Selected customer not found.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }
    if (!selectedServiceTypeDetail) {
      toast({ title: 'Error', description: 'Selected service type details not found.', variant: 'destructive'});
      setIsLoading(false);
      return;
    }
    try {
      await createOrder.mutateAsync({
        customerId: data.customerId,
        serviceTypeId: selectedServiceTypeDetail.id,
        items: undefined, // You can extend this for itemized orders
        weight: selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_KG' ? data.valueForCalculation : undefined,
        quantity: selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_ITEM' ? data.valueForCalculation : undefined,
        perfume: selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_KG' ? data.perfume : undefined,
        orderDate: new Date(),
        dueDate: data.dueDate || undefined,
        paymentStatus: 'PENDING',
        status: 'DITERIMA',
        receiptNumber: undefined,
      });
      toast({
        title: 'Order Created Successfully!',
        description: `Order for ${selectedCustomer.fullName} has been created.`,
      });
      router.push('/orders');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create order.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Create New Laundry Order</h1>
        <Button variant="outline" asChild>
          <Link href="/orders"><ArrowLeft className="mr-2 h-4 w-4" />Back to Orders</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Users className="h-6 w-6 text-primary" /> Customer & Service Details
              </CardTitle>
              <CardDescription>Select customer and service information.</CardDescription>
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
                      defaultValue={field.value}
                      disabled={isLoadingCustomers}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={isLoadingCustomers ? 'Loading...' : 'Select a customer'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.length > 0 ? customers.map((customer: Customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.fullName} ({customer.phoneNumber})
                          </SelectItem>
                        )) : <SelectItem value="-" disabled>No customers found</SelectItem>}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingServiceTypes}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={isLoadingServiceTypes ? 'Loading...' : 'Select a service type'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.map((st: ServiceType) => (
                          <SelectItem key={st.id} value={st.name}>{st.name} ({st.pricingModel === 'RUPIAH_PER_KG' ? 'Rp/kg' : 'Rp/item'})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:col-span-2">
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
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
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

          {selectedServiceTypeDetail && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                  {selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_KG' ? 
                    <Weight className="h-6 w-6 text-primary" /> : 
                    <PackageIcon className="h-6 w-6 text-primary" />
                  }
                  Laundry Details & Pricing
                </CardTitle>
                <CardDescription>
                  Price for {selectedServiceTypeDetail.name}: Rp {selectedServiceTypeDetail.price.toLocaleString('id-ID')} / {selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_KG' ? 'kg' : 'item'}.
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
                        <Input type="number" placeholder={selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_KG' ? "e.g., 2.5" : "e.g., 1"} {...field} step="0.1" className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_KG' && (
                  <FormField
                    control={form.control}
                    name="perfume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Sparkles className="mr-2 h-4 w-4 text-muted-foreground"/>Perfume Selection</FormLabel>
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
                )}
                {/* Show price per unit and estimated price */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span>Price per {selectedServiceTypeDetail.pricingModel === 'RUPIAH_PER_KG' ? 'kg' : 'item'}:</span>
                    <span className="font-semibold">Rp {pricePerUnit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Estimated Price:</span>
                    <span className="font-bold text-primary">Rp {estimatedPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base shadow-md hover:shadow-lg transition-shadow" disabled={isLoading || !selectedServiceTypeDetail}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
              Create Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
