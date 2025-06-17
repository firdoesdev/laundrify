
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'laundryPricePerKg_OBSOLETE'; // Renamed to avoid conflict if old data exists

export default function PricingSettingsPage() {
  const [pricePerKg, setPricePerKg] = useState<string>("7000"); // Default to a common value
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This page is obsolete. Logic to load from localStorage can be kept for now
    // but it won't be used by the new system.
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

    // This localStorage key is no longer actively used by the application's core logic
    localStorage.setItem(LOCAL_STORAGE_KEY, String(numericPrice));
    toast({
      title: "Price Saved (Obsolete Setting)",
      description: `Note: This global pricing setting is no longer in use. Pricing is now managed per service type.`,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Pricing Settings (Obsolete)</h1>
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Set Laundry Price (Obsolete)</CardTitle>
          <CardDescription>
            This page for setting a global laundry price per kilogram is no longer in use. 
            Pricing is now managed individually for each service type under "Service Types" settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pricePerKg" className="text-lg font-medium">Price per Kilogram (Rp) - Obsolete</Label>
            <Input
              id="pricePerKg"
              type="number"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              placeholder={`e.g., 7000`}
              className="text-base h-12"
              min="0"
              disabled // Disable input as it's obsolete
            />
            <p className="text-sm text-muted-foreground">
              This setting is no longer used. Please manage prices in the "Service Types" section.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSavePrice} disabled={isLoading || true} className="flex-1 text-base py-3 shadow-md hover:shadow-lg transition-shadow">
              <Save className="mr-2 h-5 w-5" />
              {isLoading ? 'Saving...' : 'Save Price (Obsolete)'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
