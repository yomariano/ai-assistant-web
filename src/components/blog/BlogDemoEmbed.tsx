'use client';

import dynamic from 'next/dynamic';
import type { UmamiEventData } from '@/lib/umami';

const DemoPage = dynamic(() => import('@/components/demo/DemoPage'), {
  ssr: false,
  loading: () => <div className="py-16 text-center text-muted-foreground">Loading demo...</div>,
});

interface BlogDemoEmbedProps {
  embedded?: boolean;
  trackingData?: UmamiEventData;
}

export default function BlogDemoEmbed({ embedded = false, trackingData }: BlogDemoEmbedProps) {
  return <DemoPage embedded={embedded} trackingData={trackingData} />;
}
