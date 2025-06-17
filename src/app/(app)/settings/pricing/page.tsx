
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_PRICE_PER_KG } from '@/lib/data';
import { Save, RotateCcw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'laundryPricePerKg';

export default function PricingSettingsPage() {
  const [pricePerKg, setPricePerKg] = useState<string>(String(DEFAULT_PRICE_PER_KG));
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedPrice = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedPrice) {
      setPricePerKg(storedPrice);
    }
  }, []);

  const handleSavePrice = () => {
    setIsLoading(true);
    const numericPrice = parseFloat(pricePerKg);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Price per kilogram must be a positive number.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, String(numericPrice));
    toast({
      title: "Price Saved",
      description: `Laundry price per kilogram set to Rp ${numericPrice.toLocaleString('id-ID')}.`,
    });
    setIsLoading(false);
  };

  const handleResetToDefault = () => {
    setPricePerKg(String(DEFAULT_PRICE_PER_KG));
    localStorage.setItem(LOCAL_STORAGE_KEY, String(DEFAULT_PRICE_PER_KG));
     toast({
      title: "Price Reset",
      description: `Laundry price reset to default: Rp ${DEFAULT_PRICE_PER_KG.toLocaleString('id-ID')}.`,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Pricing Settings</h1>
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Set Laundry Price</CardTitle>
          <CardDescription>
            Define the standard price per kilogram for laundry services. This price will be used for automatic calculations when creating new orders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pricePerKg" className="text-lg font-medium">Price per Kilogram (Rp)</Label>
            <Input
              id="pricePerKg"
              type="number"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              placeholder={`e.g., ${DEFAULT_PRICE_PER_KG}`}
              className="text-base h-12"
              min="0"
            />
            <p className="text-sm text-muted-foreground">
              Enter the price in Indonesian Rupiah (IDR). For example, for Rp 15.000, enter 15000.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSavePrice} disabled={isLoading} className="flex-1 text-base py-3 shadow-md hover:shadow-lg transition-shadow">
              <Save className="mr-2 h-5 w-5" />
              {isLoading ? 'Saving...' : 'Save Price'}
            </Button>
            <Button onClick={handleResetToDefault} variant="outline" className="flex-1 text-base py-3 shadow-md hover:shadow-lg transition-shadow">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
