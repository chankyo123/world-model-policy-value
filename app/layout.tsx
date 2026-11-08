import type { Metadata } from "next";
import { asset, SITE_URL } from "@/lib/site";
import "./project.css";
const title = "World-Model Value Depends on the Policy That Acts";
const description = "Evaluate world models together with the policies that act on their predictions. Explore our CoRL 2026 workshop paper, controlled experiments, and robot replays.";
const cover = new URL("media/share-cover.png", SITE_URL).href;
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website", url: SITE_URL, title,
    description,
    images: [{ url: cover, width: 1200, height: 630, alt: "Same forecast. Different value. World-model value depends on the policy that acts." }],
  },
  twitter: { card: "summary_large_image", title, description, images: [cover] },
  icons: { icon: asset("/favicon.svg"), shortcut: asset("/favicon.svg") },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head><link rel="stylesheet" href={asset("/fonts/fonts.css")} /></head>
      <body>{children}</body>
    </html>
  );
}
