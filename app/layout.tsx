import type { Metadata } from "next";
import "./project.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    "https://world-model-policy-value.ckkim10.chatgpt.site",
  ),
  title: "World-Model Value Depends on the Policy That Acts",
  description:
    "The same world-model advice can become more valuable as baseline policy performance improves. Explore our CoRL 2026 workshop paper, controlled experiments, and robot replays.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Same forecast. Different value.",
    description:
      "World-Model Value Depends on the Policy That Acts · CoRL 2026 Workshop",
    images: [
      {
        url: "/media/share-cover.png",
        width: 1200,
        height: 630,
        alt: "World-model value depends on the policy that acts.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World-Model Value Depends on the Policy That Acts",
    description:
      "Same advice. Different acting policy. A different value for prediction.",
    images: ["/media/share-cover.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
