
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metric } from '@/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{metric.title}</CardTitle>
        <metric.icon className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground">{metric.value}</div>
        {metric.change && (
          <p className={`text-sm mt-1 flex items-center ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {metric.changeType === 'positive' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            {metric.change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
