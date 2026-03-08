'use client';

import dynamic from 'next/dynamic';

const DemoPage = dynamic(() => import('@/components/demo/DemoPage'), {
  ssr: false,
  loading: () => <div className="py-16 text-center text-muted-foreground">Loading demo...</div>,
});

interface BlogDemoEmbedProps {
  embedded?: boolean;
}

export default function BlogDemoEmbed({ embedded = false }: BlogDemoEmbedProps) {
  return <DemoPage embedded={embedded} />;
}
