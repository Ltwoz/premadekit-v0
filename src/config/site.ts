type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

const site_url = process.env.NEXT_PUBLIC_APP_URL || "";

export const siteConfig: SiteConfig = {
  name: "Premade Kit",
  description:
    "Get your project off to an explosive start with Premade Kit! Harness the power of Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/premadekit",
    github: "https://github.com/Ltwoz",
  },
  mailSupport: "premadekit@gmail.com",
};
