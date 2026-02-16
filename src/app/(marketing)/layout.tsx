import { OrganizationSchema, ProductSchema, WebSiteSchema } from "@/components/seo";
import CROWidgets from "@/components/marketing/CROWidgets";

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
      {children}
      <CROWidgets />
    </>
  );
}
