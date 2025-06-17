
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit3, Trash2, MoreVertical, Mail, Phone, ArrowUpDown, MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import type { Customer } from '@/types';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sampleCustomers } from '@/lib/data'; // Import to modify global array on delete

interface CustomerTableProps {
  customers: Customer[];
}

export function CustomerTable({ customers: initialCustomers }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer | null; direction: 'ascending' | 'descending' } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  const handleSort = (key: keyof Customer) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = React.useMemo(() => {
    let sortableItems = [...customers];
    if (sortConfig !== null && sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (valA === undefined || valB === undefined) return 0;
        
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
           if (sortConfig.key === 'joinDate' || sortConfig.key === 'lastOrderDate') {
             const dateA = new Date(valA as string).getTime();
             const dateB = new Date(valB as string).getTime();
             return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
           }
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
  }, [customers, sortConfig]);


  const filteredCustomers = sortedCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    customer.phone.includes(searchTerm)
  );

  const handleDeleteCustomer = (customerId: string) => {
    // Update local state for immediate UI feedback
    const updatedCustomers = customers.filter(customer => customer.id !== customerId);
    setCustomers(updatedCustomers);

    // Update global sampleCustomers array
    const index = sampleCustomers.findIndex(customer => customer.id === customerId);
    if (index > -1) {
      sampleCustomers.splice(index, 1);
    }
    
    toast({
      title: 'Customer Deleted',
      description: `Customer ${customerId} has been deleted.`,
    });
    // router.refresh(); // To ensure data consistency on the page
  };
  
  const getSortIcon = (key: keyof Customer) => {
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
        placeholder="Search by Name, Email, or Phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm h-10"
      />
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center">
                  Name {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Contact & Address</TableHead>
              <TableHead onClick={() => handleSort('joinDate')} className="cursor-pointer hidden lg:table-cell">
                <div className="flex items-center">
                  Join Date {getSortIcon('joinDate')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('totalOrders')} className="cursor-pointer text-right hidden sm:table-cell">
                <div className="flex items-center justify-end">
                  Total Orders {getSortIcon('totalOrders')}
                </div>
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatarUrl || `https://avatar.vercel.sh/${customer.email || customer.name}.png?size=40`} alt={customer.name} data-ai-hint="person face" />
                      <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                     <Link href={`/customers/${customer.id}`} className="hover:underline">{customer.name}</Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col text-xs">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" /> {customer.phone}
                      </span>
                      {customer.email && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" /> {customer.email}
                        </span>
                      )}
                      {customer.address && (
                        <span className="flex items-center gap-1 text-muted-foreground mt-0.5">
                          <MapPin className="h-3 w-3" /> {customer.address}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{format(new Date(customer.joinDate), 'PP', { locale: dateFnsLocaleId })}</TableCell>
                  <TableCell className="text-right hidden sm:table-cell">{customer.totalOrders}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                           <span className="sr-only">Customer actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/customers/${customer.id}`} className="flex items-center w-full">
                            <User className="mr-2 h-4 w-4" /> View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/customers/edit/${customer.id}`} className="flex items-center w-full">
                            <Edit3 className="mr-2 h-4 w-4" /> Edit Customer
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive flex items-center w-full">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Showing {filteredCustomers.length} of {customers.length} total customers in current view</span>
        {/* Basic pagination placeholder */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
