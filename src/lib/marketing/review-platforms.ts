export type ReviewPlatformStatus = "Claimed" | "Validated" | "Live";

export interface ReviewPlatform {
  id: "trustpilot" | "g2" | "capterra";
  name: string;
  logo: string;
  href: string;
  status: ReviewPlatformStatus;
}

export const REVIEW_PLATFORMS: ReviewPlatform[] = [
  {
    id: "trustpilot",
    name: "Trustpilot",
    logo: "/integrations/trustpilot.svg",
    href: "https://www.trustpilot.com/",
    status: "Claimed",
  },
  {
    id: "g2",
    name: "G2",
    logo: "/integrations/g2.svg",
    href: "https://www.g2.com/",
    status: "Validated",
  },
  {
    id: "capterra",
    name: "Capterra",
    logo: "/integrations/capterra.png",
    href: "https://www.capterra.com/",
    status: "Live",
  },
];
