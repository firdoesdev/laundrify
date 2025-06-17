
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { ServiceType } from '@/types';
import { sampleServiceTypes } from '@/lib/data';
import { Save, ArrowLeft, Loader2, AlertTriangle, ClipboardList } from 'lucide-react';
import Link from 'next/link';

const serviceTypeFormSchema = z.object({
  name: z.string().min(2, { message: "Service type name must be at least 2 characters." }),
});

type ServiceTypeFormValues = z.infer<typeof serviceTypeFormSchema>;

export default function EditServiceTypePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const serviceTypeId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [originalServiceType, setOriginalServiceType] = useState<ServiceType | null>(null);

  const form = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(serviceTypeFormSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (serviceTypeId) {
      const foundServiceType = sampleServiceTypes.find(st => st.id === serviceTypeId);
      if (foundServiceType) {
        setOriginalServiceType(foundServiceType);
        form.reset({
          name: foundServiceType.name,
        });
      }
      setIsFetchingData(false);
    }
  }, [serviceTypeId, form]);

  const onSubmit: SubmitHandler<ServiceTypeFormValues> = (data) => {
    setIsLoading(true);
    const serviceTypeIndex = sampleServiceTypes.findIndex(st => st.id === serviceTypeId);

    if (serviceTypeIndex > -1 && originalServiceType) {
      const updatedServiceType: ServiceType = {
        ...originalServiceType, 
        name: data.name,
      };
      sampleServiceTypes[serviceTypeIndex] = updatedServiceType;

      toast({
        title: 'Service Type Updated!',
        description: `Service Type "${updatedServiceType.name}" has been updated.`,
      });
      setIsLoading(false);
      router.push(`/service-types`); 
      router.refresh();
    } else {
      toast({
        title: 'Error Updating Service Type',
        description: 'Service Type not found.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  if (isFetchingData) {
    return <div className="flex justify-center items-center h-64">Loading service type data...</div>;
  }

  if (!originalServiceType && !isFetchingData) {
     return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Service Type Not Found</h2>
        <p className="text-muted-foreground mb-6">The service type with ID "{serviceTypeId}" could not be found for editing.</p>
        <Button asChild>
          <Link href="/service-types">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Service Types
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Edit Service Type: {originalServiceType?.name}</h1>
         <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <ClipboardList className="h-6 w-6 text-primary" /> Service Type Details
              </CardTitle>
              <CardDescription>Update the name of the service type.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Regular Kilogram" {...field} className="h-11" />
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
