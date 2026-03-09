import { Suspense } from "react";
import { OrganizationSchema, ProductSchema, WebSiteSchema } from "@/components/seo";
import CROWidgets from "@/components/marketing/CROWidgets";
import AuthErrorBanner from "@/components/ui/AuthErrorBanner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
      <ProductSchema />
      <Suspense fallback={null}>
        <AuthErrorBanner />
      </Suspense>
      {children}
      <CROWidgets />
    </>
  );
}
