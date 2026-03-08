'use client';

import dynamic from 'next/dynamic';

const DemoPage = dynamic(() => import('@/components/demo/DemoPage'), {
  ssr: false,
  loading: () => <div className="py-16 text-center text-muted-foreground">Loading demo...</div>,
});

export default function BlogDemoEmbed() {
  return <DemoPage />;
}
