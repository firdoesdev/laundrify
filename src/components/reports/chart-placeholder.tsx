
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChartBig, LineChart, PieChart } from 'lucide-react';
import Image from 'next/image';

interface ChartPlaceholderProps {
  title: string;
  description?: string;
  iconType?: 'bar' | 'line' | 'pie';
  dataAiHint?: string;
}

export function ChartPlaceholder({ title, description, iconType = 'bar', dataAiHint = "chart graph" }: ChartPlaceholderProps) {
  const Icon = iconType === 'line' ? LineChart : iconType === 'pie' ? PieChart : BarChartBig;
  
  return (
    <Card className="shadow-lg col-span-1 md:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center">
           <Image 
              src={`https://placehold.co/600x300.png`}
              alt={`${title} placeholder chart`}
              width={600}
              height={300}
              className="rounded-md opacity-70"
              data-ai-hint={dataAiHint}
            />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Chart data will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}
