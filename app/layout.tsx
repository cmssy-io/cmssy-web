import type { Metadata } from "next";
import "../styles/main.css";
import { buildSiteMetadata } from "@/cmssy/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata();
}

// Pure static shell. Everything locale- or content-dependent lives in the
// segment layouts (app/[[...path]]/layout.tsx and the edit route), which
// receive params - reading headers() here would force every route dynamic.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
