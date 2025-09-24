'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppSidebar from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('authToken');
      if (!token && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isClient, pathname, router]);

  // Render a loading state on the server or until the client-side check is complete
  if (!isClient) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Carregando...</p>
        </div>
    );
  }

  // If we are on the login page, we don't want to show the sidebar
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
