
"use client";
import { MetricCard } from '@/components/reports/metric-card';
import { ChartPlaceholder } from '@/components/reports/chart-placeholder';
import { DollarSign, ShoppingCart, Users, Percent, RefreshCw } from 'lucide-react';
import type { Metric } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import React from "react";


const reportMetrics: Metric[] = [
  { title: 'Monthly Revenue', value: 'Rp 4.820.000', icon: DollarSign, change: '+15.3%', changeType: 'positive' },
  { title: 'Orders This Month', value: '78', icon: ShoppingCart, change: '+5', changeType: 'positive' },
  { title: 'New Customers', value: '12', icon: Users, change: '+2', changeType: 'positive' },
  { title: 'Average Order Value', value: 'Rp 61.790', icon: Percent, change: '-1.2%', changeType: 'negative' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  type DateRange = { from: Date; to?: Date };


  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Reports & Analytics</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className="w-[240px] justify-start text-left font-normal h-10 shadow-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => setDateRange(range as DateRange)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="default" className="h-10 shadow-md hover:shadow-lg transition-shadow">
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <ChartPlaceholder 
          title="Revenue Over Time" 
          description="Tracks total revenue within the selected date range."
          iconType="line"
          dataAiHint="revenue graph"
        />
        <ChartPlaceholder 
          title="Order Volume by Service" 
          description="Breakdown of orders by service type."
          iconType="bar"
          dataAiHint="order volume"
        />
        <ChartPlaceholder 
          title="Customer Acquisition Trend" 
          description="Shows new customer sign-ups over time."
          iconType="line"
          dataAiHint="customer trend"
        />
        <ChartPlaceholder 
          title="Order Status Distribution" 
          description="Current distribution of orders by status."
          iconType="pie"
          dataAiHint="status distribution"
        />
      </div>
    </div>
  );
}
