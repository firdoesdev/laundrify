"use client";


import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import { useServiceTypes } from '@/hooks/useServiceTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Weight, Sparkles, DollarSign, Loader2, Users, ArrowLeft, PackageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus, PaymentStatus } from '@/types';

export default function EditOrderPage() {


  // Set up all hooks and variables at the top, only once
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();
  const { toast } = useToast();
  const { orders, updateOrder, isLoading } = useOrders();
  const serviceTypesQuery = useServiceTypes();
  const serviceTypes = serviceTypesQuery.data ?? [];
  const { customers = [], isLoading: isLoadingCustomers } = useCustomers();

  // Find the order and set up the form only once
  const currentOrder = Array.isArray(orders) ? orders.find((o) => o.id === id) : undefined;
  const form = useForm({
    resolver: undefined as any, // will set after schema is built
    defaultValues: currentOrder || {},
  });


  // Find the selected service type for conditional logic
  const selectedServiceType = serviceTypes.find((st: any) => st.id === form.watch('serviceTypeId'));
  const isWeightBased = selectedServiceType?.unit === 'kg';
  const isQuantityBased = selectedServiceType?.unit === 'pcs';

  // --- Download Receipt Feature ---
  function handleDownloadReceipt() {
    const order = form.getValues();
    const customer = customers.find((c: any) => c.id === order.customerId);
    const serviceType = serviceTypes.find((st: any) => st.id === order.serviceTypeId);
    const doc = new jsPDF();

    // Placeholder logo (rectangle)
    doc.setFillColor(200, 200, 200);
    doc.rect(15, 10, 30, 20, 'F');
    doc.setFontSize(18);
    doc.text('Laundry Receipt', 50, 20);

    doc.setFontSize(12);
    doc.text('Business Name', 15, 38);
    doc.text('Jl. Placeholder No. 123, Jakarta', 15, 44);
    doc.text('0812-XXXX-XXXX', 15, 50);

    doc.setLineWidth(0.5);
    doc.line(15, 54, 195, 54);

    doc.setFontSize(14);
    doc.text('Order Information', 15, 62);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id || id}`, 15, 70);
    doc.text(`Date: ${order.dueDate ? format(order.dueDate, 'PPP', { locale: dateFnsLocaleId }) : '-'}`, 120, 70);

    doc.text('Customer:', 15, 80);
    doc.text(`Name: ${customer?.fullName || '-'}`, 25, 86);
    doc.text(`Phone: ${customer?.phoneNumber || '-'}`, 25, 92);

    doc.text('Service:', 15, 102);
    doc.text(`Type: ${serviceType?.name || '-'}`, 25, 108);
    if (order.perfume) doc.text(`Perfume: ${order.perfume}`, 25, 114);
    if (order.weight) doc.text(`Weight: ${order.weight} kg`, 25, 120);
    if (order.quantity) doc.text(`Quantity: ${order.quantity}`, 25, 126);

    doc.setLineWidth(0.2);
    doc.line(15, 132, 195, 132);

    doc.text('Pricing:', 15, 140);
    const pricePerUnit = serviceType?.price || 0;
    const isWeightBased = serviceType?.unit === 'kg';
    const isQuantityBased = serviceType?.unit === 'pcs';
    const estimatedPrice = isWeightBased
      ? (Number(order.weight) || 0) * pricePerUnit
      : isQuantityBased
        ? (Number(order.quantity) || 0) * pricePerUnit
        : 0;
    doc.text(`Price per ${isWeightBased ? 'kg' : isQuantityBased ? 'pcs' : 'unit'}: Rp ${pricePerUnit.toLocaleString('id-ID')}`, 25, 146);
    doc.text(`Estimated Price: Rp ${estimatedPrice.toLocaleString('id-ID')}`, 25, 152);

    doc.text(`Status: ${order.status}`, 15, 162);
    doc.text(`Payment: ${order.paymentStatus}`, 120, 162);

    doc.setLineWidth(0.2);
    doc.line(15, 168, 195, 168);

    doc.setFontSize(12);
    doc.text('Please bring this receipt for order pickup.', 15, 178);
    doc.text('Thank you for using our laundry service!', 15, 184);

    doc.save(`laundry-receipt-${order.id || id}.pdf`);
  }

  // Ensure perfume field is always present in form state for weight-based
  React.useEffect(() => {
    if (isWeightBased && form.getValues('perfume') === undefined) {
      form.setValue('perfume', currentOrder?.perfume || '');
    }
    if (!isWeightBased) {
      form.setValue('perfume', undefined);
    }
    // eslint-disable-next-line
  }, [isWeightBased, currentOrder]);

  // Reset form when order changes
  useEffect(() => {
    if (currentOrder) {
      form.reset(currentOrder);
    }
    // eslint-disable-next-line
  }, [currentOrder]);

  if (!currentOrder) {
    return <div className="py-10 text-center text-muted-foreground">Order not found.</div>;
  }


  // Add price to schema for display (not editable)
  // The schema and resolver must be defined outside of render/conditional logic to avoid hook order issues
  const baseOrderSchema = z.object({
    customerId: z.string().min(1, { message: "Please select a customer." }),
    serviceTypeId: z.string().min(1, { message: "Please select a service type." }),
    weight: z.union([z.string(), z.number()]).optional(),
    quantity: z.union([z.string(), z.number()]).optional(),
    perfume: z.string().optional(),
    dueDate: z.date().optional(),
    status: z.enum(['DITERIMA', 'DICUCI', 'SIAP_DIAAMBIL', 'SELESAI', 'DIBATALKAN']),
    paymentStatus: z.enum(['PENDING', 'PAID', 'CANCELLED']),
  });

  // Custom resolver to handle conditional validation
  const orderSchema = baseOrderSchema.refine((data) => {
    // Validate weight if weight-based
    if (isWeightBased && (!data.weight || Number(data.weight) <= 0)) {
      return false;
    }
    // Validate quantity if quantity-based
    if (isQuantityBased && (!data.quantity || Number(data.quantity) <= 0)) {
      return false;
    }
    return true;
  }, {
    message: isWeightBased
      ? "Weight required for this service type"
      : isQuantityBased
        ? "Quantity required for this service type"
        : undefined,
    path: isWeightBased ? ["weight"] : isQuantityBased ? ["quantity"] : [],
  });

  // Set resolver after schema is built
  // @ts-expect-error: dynamic resolver assignment for zod schema
  form.resolver = zodResolver(orderSchema);

  const onSubmit = async (data: any) => {
    try {
      await updateOrder.mutateAsync({
        id,
        data: {
          ...data,
          perfume: isWeightBased ? data.perfume : undefined,
        },
      });
      toast({ title: "Order updated" });
      router.push("/orders");
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message || "Failed to update order.", variant: "destructive" });
    }
  };

  // Calculate estimated price reactively
  const pricePerUnit = selectedServiceType?.price ?? 0;
  const weight = Number(form.watch('weight')) || 0;
  const quantity = Number(form.watch('quantity')) || 0;
  const estimatedPrice = isWeightBased ? weight * pricePerUnit : isQuantityBased ? quantity * pricePerUnit : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Edit Order</h1>
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Users className="h-6 w-6 text-primary" /> Customer & Service Details
              </CardTitle>
              <CardDescription>Edit customer and service information.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              {/* ...existing code for customerId and serviceTypeId ... */}
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
                        {customers.length > 0 ? customers.map((customer: any) => (
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
                name="serviceTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.map((st: any) => (
                          <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
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

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <PackageIcon className="h-6 w-6 text-primary" /> Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              {/* Conditional fields for weight/quantity based on service type */}
              {/* Perfume Selection only for weight-based service types */}
              {isWeightBased && (
                <>
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
                            {["Ocean Fresh", "Lavender Bliss", "Spring Dew", "Citrus Burst", "Unscented"].map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0.1} step={0.1} {...field} className="h-11" disabled={!isWeightBased} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {isQuantityBased && (
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} step={1} {...field} className="h-11" disabled={!isQuantityBased} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Show price per unit and estimated price */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <div className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Price per {isWeightBased ? 'kg' : isQuantityBased ? 'pcs' : 'unit'}:</span>
                  <span className="font-semibold">Rp {pricePerUnit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Estimated Price:</span>
                  <span className="font-bold text-primary">Rp {estimatedPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
              {/* ...existing code for status and paymentStatus... */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DITERIMA">Diterima</SelectItem>
                          <SelectItem value="DICUCI">Dicuci</SelectItem>
                          <SelectItem value="SIAP_DIAAMBIL">Siap Diambil</SelectItem>
                          <SelectItem value="SELESAI">Selesai</SelectItem>
                          <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4 gap-4 flex-col md:flex-row md:items-center">
            {/* Download Receipt button only when order is DITERIMA */}
            {form.watch('status') === 'DITERIMA' && (
              <Button
                type="button"
                variant="secondary"
                className="text-base shadow-md hover:shadow-lg transition-shadow"
                onClick={handleDownloadReceipt}
              >
                <span className="mr-2 h-5 w-5 inline-block align-middle">🧾</span> Download Receipt
              </Button>
            )}
            <Button type="submit" size="lg" className="text-base shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Update Order
            </Button>
          </div>


        </form>
      </Form>
    </div>
  );
}

