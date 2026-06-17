"use client";

// PlatformChrome wraps all routes from the root layout. It renders the platform
// header (and, from section 04, the footer) on every page EXCEPT the /payment
// subtree, which is the relocated enrollment gateway and renders its own header
// inside HomeClient. Next.js child layouts cannot strip parent chrome, so we
// gate on the pathname here instead.

import { usePathname } from "next/navigation";
import PlatformHeader from "./PlatformHeader";
import PlatformFooter from "./PlatformFooter";

export default function PlatformChrome({ children }) {
  const pathname = usePathname();
  const isPayment = pathname === "/payment" || pathname.startsWith("/payment/");

  if (isPayment) {
    return <>{children}</>;
  }

  return (
    <>
      <PlatformHeader />
      <div className="pt-16">{children}</div>
      <PlatformFooter />
    </>
  );
}
