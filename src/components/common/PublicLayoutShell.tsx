'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SmoothScroll } from '@/components/common/SmoothScroll';
import { InquiryProvider } from '@/components/inquiry/InquiryContext';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { StoreLocation, SiteSettingsData } from '@/types';

interface PublicLayoutShellProps {
  children: React.ReactNode;
  primaryStore: StoreLocation;
  siteSettings: SiteSettingsData;
}

/**
 * PublicLayoutShell handles rendering the public Header, Footer, SmoothScroll,
 * and Cart / Inquiry Modal on public routes while cleanly omitting them on /admin routes.
 */
export function PublicLayoutShell({
  children,
  primaryStore,
  siteSettings,
}: PublicLayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1 w-full min-h-screen">{children}</main>;
  }

  return (
    <InquiryProvider>
      <Header primaryStore={primaryStore} siteSettings={siteSettings} />
      <SmoothScroll>
        <main className="flex-1 w-full max-w-full">{children}</main>
        <Footer primaryStore={primaryStore} siteSettings={siteSettings} />
      </SmoothScroll>
      <InquiryModal />
    </InquiryProvider>
  );
}
