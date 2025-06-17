
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit3, Trash2, MoreVertical, ArrowUpDown, ArrowUp, ArrowDown, ClipboardList, Weight, PackageIcon } from 'lucide-react';
import type { ServiceType } from '@/types';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sampleServiceTypes } from '@/lib/data';
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
import { Badge } from '@/components/ui/badge';

interface ServiceTypeTableProps {
  serviceTypes: ServiceType[];
}

export function ServiceTypeTable({ serviceTypes: initialServiceTypes }: ServiceTypeTableProps) {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(initialServiceTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ServiceType | null; direction: 'ascending' | 'descending' } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setServiceTypes(initialServiceTypes);
  }, [initialServiceTypes]);

  const handleSort = (key: keyof ServiceType) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedServiceTypes = React.useMemo(() => {
    let sortableItems = [...serviceTypes];
    if (sortConfig !== null && sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (valA === undefined || valB === undefined) return 0;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        const stringA = String(valA);
        const stringB = String(valB);
        if (stringA < stringB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (stringA > stringB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [serviceTypes, sortConfig]);


  const filteredServiceTypes = sortedServiceTypes.filter(st =>
    st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteServiceType = (serviceTypeId: string, serviceTypeName: string) => {
    const updatedServiceTypes = serviceTypes.filter(st => st.id !== serviceTypeId);
    setServiceTypes(updatedServiceTypes);

    const index = sampleServiceTypes.findIndex(st => st.id === serviceTypeId);
    if (index > -1) {
      sampleServiceTypes.splice(index, 1);
    }

    toast({
      title: 'Service Type Deleted',
      description: `Service Type "${serviceTypeName}" has been deleted.`,
    });
    router.refresh();
  };

  const getSortIcon = (key: keyof ServiceType) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by Name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm h-10"
      />
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('id')} className="cursor-pointer w-[150px]">
                <div className="flex items-center">
                  ID {getSortIcon('id')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center">
                  Name {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('pricingModel')} className="cursor-pointer w-[180px]">
                <div className="flex items-center">
                  Pricing Model {getSortIcon('pricingModel')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('price')} className="cursor-pointer w-[150px] text-right">
                <div className="flex items-center justify-end">
                  Price {getSortIcon('price')}
                </div>
              </TableHead>
              <TableHead className="text-center w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServiceTypes.length > 0 ? (
              filteredServiceTypes.map((st) => (
                <TableRow key={st.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-muted-foreground">{st.id}</TableCell>
                  <TableCell className="font-medium text-primary">
                    {st.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {st.pricingModel === 'per_kg' ? 
                        <Weight className="mr-2 h-4 w-4"/> : 
                        <PackageIcon className="mr-2 h-4 w-4" /> }
                      {st.pricingModel.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {'Rp ' + st.price.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Service Type actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/service-types/edit/${st.id}`} className="flex items-center w-full">
                            <Edit3 className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive-foreground focus:bg-destructive w-full">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the service type
                                <span className="font-semibold"> {st.name}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteServiceType(st.id, st.name)} className="bg-destructive hover:bg-destructive/90">
                                Yes, delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No service types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Showing {filteredServiceTypes.length} of {serviceTypes.length} total service types.</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
