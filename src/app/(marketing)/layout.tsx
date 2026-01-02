import { OrganizationSchema, ProductSchema } from "@/components/seo";

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
    </>
  );
}
