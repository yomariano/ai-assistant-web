import { permanentRedirect } from "next/navigation";

interface Props {
  params: Promise<{ industry: string }>;
}

/**
 * Catch bare industry URLs like /dental, /restaurants and redirect
 * to the canonical /for/{industry} use-case page.
 */
export default async function IndustryRedirect({ params }: Props) {
  const { industry } = await params;
  permanentRedirect(`/for/${industry}`);
}
