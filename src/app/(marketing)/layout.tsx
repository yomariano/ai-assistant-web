import { OrganizationSchema, ProductSchema } from "@/components/seo";
import CROWidgets from "@/components/marketing/CROWidgets";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationSchema />
      <ProductSchema />
      {children}
      <CROWidgets />
    </>
  );
}
