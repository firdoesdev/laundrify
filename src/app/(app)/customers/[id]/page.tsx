"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, CalendarPlus, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const customerId = params.id as string;
  const { customers, isLoading, isError, deleteCustomer } = useCustomers();
  const customer = customers?.find((c) => c.id === customerId);

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      toast({
        title: 'Customer Deleted',
        description: `Customer has been successfully deleted.`,
      });
      router.push('/customers');
    } catch (error: any) {
      toast({
        title: 'Error Deleting Customer',
        description: error.message || 'Failed to delete customer.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading customer details...</div>;
  }

  if (isError || !customer) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground mb-6">The customer with ID "{customerId}" could not be found.</p>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary shadow-md">
            <AvatarImage src={`https://avatar.vercel.sh/${customer.email || customer.fullName}.png?size=80`} alt={customer.fullName} data-ai-hint="person face"/>
            <AvatarFallback className="text-2xl">{customer.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">{customer.fullName}</h1>
            <p className="text-muted-foreground">Customer ID: {customer.id}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push('/customers')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="h-7 w-7 text-primary" />
            Customer Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex items-center">
            <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Phone</p>
              <p className="text-foreground text-base">{customer.phoneNumber}</p>
            </div>
          </div>
          {customer.email && (
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Email</p>
                <p className="text-foreground text-base">{customer.email}</p>
              </div>
            </div>
          )}
          {customer.address && (
            <div className="flex items-center md:col-span-2">
              <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Address</p>
                <p className="text-foreground text-base">{customer.address}</p>
              </div>
            </div>
          )}
          <div className="flex items-center">
            <CalendarPlus className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Join Date</p>
              <p className="text-foreground text-base">{customer.createdAt ? format(new Date(customer.createdAt), 'PPP', { locale: dateFnsLocaleId }) : '-'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <ShoppingBag className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Total Orders</p>
              <p className="text-foreground text-base">{customer.totalOrders}</p>
            </div>
          </div>
           {customer.lastOrderDate && (
            <div className="flex items-center">
              <CalendarPlus className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Last Order Date</p>
                <p className="text-foreground text-base">{format(new Date(customer.lastOrderDate), 'PPP', { locale: dateFnsLocaleId })}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href={`/customers/edit/${customer.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Customer
            </Link>
          </Button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete customer 
                  <span className="font-semibold"> {customer.fullName}</span> and all associated data (not really in this prototype).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCustomer} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete customer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
