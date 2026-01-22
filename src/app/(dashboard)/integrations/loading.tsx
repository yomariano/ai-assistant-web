import { Card, CardContent } from '@/components/ui/card';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export default function IntegrationsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Mode Selection Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardContent className="p-6">
            <Skeleton className="h-14 w-14 rounded-xl mb-4" />
            <Skeleton className="h-6 w-44 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-5 w-32" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardContent className="p-6">
            <Skeleton className="h-14 w-14 rounded-xl mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-5 w-24" />
          </CardContent>
        </Card>
      </div>

      {/* Template Selector */}
      <Card className="border-none shadow-md ring-1 ring-slate-200">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Fields */}
      <Card className="border-none shadow-md ring-1 ring-slate-200">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Settings */}
      <Card className="border-none shadow-md ring-1 ring-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-slate-200">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
