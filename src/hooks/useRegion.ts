/**
 * useRegion Hook
 *
 * Detects user's region and returns geo-targeted pricing information.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  getFallbackRegionData,
  getRouteRegionOverride,
  type SupportedRegion,
} from '@/lib/market';

interface Plan {
  id: string;
  price: number;
  formattedPrice: string;
  monthlyMinutes: number;
  paymentLink: string | null;
}

interface ApiPlan {
  id: string;
  price: number;
  formattedPrice: string;
  minutesIncluded: number;
  paymentLink: string | null;
}

interface RegionData {
  detected: boolean;
  region: string;
  regionName: string;
  currency: string;
  currencySymbol: string;
  telephonyProvider: string;
  city: string | null;
  plans: Plan[];
}

interface UseRegionReturn {
  region: string | null;
  regionName: string | null;
  city: string | null;
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
const CACHE_DURATION_MS = 5 * 60 * 1000;
const regionCache = new Map<string, { data: RegionData; timestamp: number }>();

function getCacheKey(regionOverride: SupportedRegion | null): string {
  return regionOverride ? `region:${regionOverride}` : 'region:auto';
}

function getCachedRegionData(cacheKey: string): RegionData | null {
  const cachedEntry = regionCache.get(cacheKey);
  if (!cachedEntry) return null;

  if (Date.now() - cachedEntry.timestamp >= CACHE_DURATION_MS) {
    regionCache.delete(cacheKey);
    return null;
  }

  return cachedEntry.data;
}

function mapApiResponseToRegionData(apiResponse: {
  city?: string | null;
  plans: ApiPlan[];
  [key: string]: unknown;
}): RegionData {
  return {
    ...(apiResponse as Omit<RegionData, 'city' | 'plans'>),
    city: apiResponse.city || null,
    plans: apiResponse.plans.map((plan: ApiPlan) => ({
      id: plan.id,
      price: plan.price,
      formattedPrice: plan.formattedPrice,
      monthlyMinutes: plan.minutesIncluded,
      paymentLink: plan.paymentLink,
    })),
  };
}

function getFallbackAsRegionData(regionOverride: SupportedRegion = 'EU'): RegionData {
  const fallbackData = getFallbackRegionData(regionOverride);
  return {
    detected: false,
    ...fallbackData,
  };
}

export function useRegion(): UseRegionReturn {
  const pathname = usePathname();
  const routeRegion = getRouteRegionOverride(pathname);
  const cacheKey = getCacheKey(routeRegion);

  const [data, setData] = useState<RegionData | null>(() => getCachedRegionData(cacheKey));
  const [loading, setLoading] = useState(!getCachedRegionData(cacheKey));
  const [error, setError] = useState<string | null>(null);

  const fetchRegion = useCallback(async (force = false) => {
    const cachedData = getCachedRegionData(cacheKey);
    if (!force && cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = routeRegion
        ? `${API_URL}/api/billing/region?region=${routeRegion}`
        : `${API_URL}/api/billing/region`;

      const response = await fetch(endpoint, {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to detect region');
      }

      const regionData = mapApiResponseToRegionData(await response.json());
      regionCache.set(cacheKey, { data: regionData, timestamp: Date.now() });
      setData(regionData);
    } catch (err) {
      console.error('Error fetching region:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      const fallbackData = getFallbackAsRegionData(routeRegion || 'EU');
      regionCache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, routeRegion]);

  useEffect(() => {
    const cachedData = getCachedRegionData(cacheKey);
    setData(cachedData);
    setLoading(!cachedData);
    void fetchRegion();
  }, [cacheKey, fetchRegion]);

  const formatPrice = useCallback(
    (price: number): string => {
      if (!data) return `$${price}`;
      return `${data.currencySymbol}${price}`;
    },
    [data]
  );

  const getPlan = useCallback(
    (planId: string): Plan | undefined => {
      return data?.plans.find((plan) => plan.id === planId);
    },
    [data]
  );

  const getPaymentLink = useCallback(
    (planId: string): string | null => {
      return data?.plans.find((plan) => plan.id === planId)?.paymentLink || null;
    },
    [data]
  );

  return {
    region: data?.region || null,
    regionName: data?.regionName || null,
    city: data?.city || null,
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

export async function getRegionFromServer(regionOverride?: SupportedRegion): Promise<RegionData> {
  try {
    const endpoint = regionOverride
      ? `${API_URL}/api/billing/region?region=${regionOverride}`
      : `${API_URL}/api/billing/region`;

    const response = await fetch(endpoint, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to detect region');
    }

    return mapApiResponseToRegionData(await response.json());
  } catch {
    return getFallbackAsRegionData(regionOverride || 'EU');
  }
}
