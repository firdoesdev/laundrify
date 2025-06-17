
"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ServiceTypeTable } from '@/components/service-types/service-type-table';
import { sampleServiceTypes } from '@/lib/data'; 
import { PlusCircle } from 'lucide-react';
import React from 'react';


export default function ServiceTypesPage() {
  const serviceTypes = [...sampleServiceTypes]; 

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Manage Service Types</h1>
        <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/service-types/add">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Service Type
          </Link>
        </Button>
      </div>
      <ServiceTypeTable serviceTypes={serviceTypes} />
    </div>
  );
}
