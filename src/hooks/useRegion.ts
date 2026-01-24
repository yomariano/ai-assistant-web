/**
 * useRegion Hook
 *
 * Detects user's region and returns geo-targeted pricing information.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface Plan {
  id: string;
  price: number;
  formattedPrice: string;
  monthlyMinutes: number;
  paymentLink: string | null;
}

interface RegionData {
  detected: boolean;
  region: string;
  regionName: string;
  currency: string;
  currencySymbol: string;
  telephonyProvider: string;
  plans: Plan[];
}

interface UseRegionReturn {
  region: string | null;
  regionName: string | null;
  currency: string | null;
  currencySymbol: string | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  formatPrice: (price: number) => string;
  getPlan: (planId: string) => Plan | undefined;
  getPaymentLink: (planId: string) => string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Cache the region data to avoid repeated API calls
let cachedData: RegionData | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export function useRegion(): UseRegionReturn {
  const [data, setData] = useState<RegionData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  const fetchRegion = useCallback(async (force = false) => {
    // Use cache if available and not expired
    if (!force && cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/billing/region`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to detect region');
      }

      const regionData: RegionData = await response.json();

      // Update cache
      cachedData = regionData;
      cacheTimestamp = Date.now();

      setData(regionData);
    } catch (err) {
      console.error('Error fetching region:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      // Fallback to US pricing
      const fallbackData: RegionData = {
        detected: false,
        region: 'US',
        regionName: 'United States',
        currency: 'USD',
        currencySymbol: '$',
        telephonyProvider: 'telnyx',
        plans: [
          { id: 'starter', price: 49, formattedPrice: '$49', monthlyMinutes: 100, paymentLink: null },
          { id: 'growth', price: 199, formattedPrice: '$199', monthlyMinutes: 500, paymentLink: null },
          { id: 'pro', price: 599, formattedPrice: '$599', monthlyMinutes: 1500, paymentLink: null },
        ],
      };
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegion();
  }, [fetchRegion]);

  const formatPrice = useCallback(
    (price: number): string => {
      if (!data) return `$${price}`;
      return `${data.currencySymbol}${price}`;
    },
    [data]
  );

  const getPlan = useCallback(
    (planId: string): Plan | undefined => {
      return data?.plans.find((p) => p.id === planId);
    },
    [data]
  );

  const getPaymentLink = useCallback(
    (planId: string): string | null => {
      return data?.plans.find((p) => p.id === planId)?.paymentLink || null;
    },
    [data]
  );

  return {
    region: data?.region || null,
    regionName: data?.regionName || null,
    currency: data?.currency || null,
    currencySymbol: data?.currencySymbol || null,
    plans: data?.plans || [],
    loading,
    error,
    refetch: () => fetchRegion(true),
    formatPrice,
    getPlan,
    getPaymentLink,
  };
}

// Static helper for server components
export async function getRegionFromServer(): Promise<RegionData> {
  try {
    const response = await fetch(`${API_URL}/api/billing/region`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to detect region');
    }

    return response.json();
  } catch {
    // Fallback to US
    return {
      detected: false,
      region: 'US',
      regionName: 'United States',
      currency: 'USD',
      currencySymbol: '$',
      telephonyProvider: 'telnyx',
      plans: [
        { id: 'starter', price: 49, formattedPrice: '$49', monthlyMinutes: 100, paymentLink: null },
        { id: 'growth', price: 199, formattedPrice: '$199', monthlyMinutes: 500, paymentLink: null },
        { id: 'pro', price: 599, formattedPrice: '$599', monthlyMinutes: 1500, paymentLink: null },
      ],
    };
  }
}
