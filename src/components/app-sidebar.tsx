'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  History,
  LayoutDashboard,
  PieChart,
  Server,
  Users,
  User,
  Vote,
  VoteIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
  { href: '/urnas', icon: Server, label: 'Urnas' },
  { href: '/eleicoes', icon: Vote, label: 'Eleições' },
  { href: '/candidatos', icon: Users, label: 'Candidatos' },
  { href: '/eleitores', icon: User, label: 'Eleitores' },
  { href: '/resultados', icon: PieChart, label: 'Resultados' },
  { href: '/auditoria', icon: History, label: 'Logs de Auditoria' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center md:hidden">
              <SidebarTrigger />
            </div>
            <VoteIcon className="h-7 w-7 text-accent" />
            <h1 className="text-xl font-semibold">Voto Seguro</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  asChild={false}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/seed/admin/40/40" alt="Admin" data-ai-hint="person avatar" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin</span>
            <span className="text-xs text-muted-foreground">admin@voto.seg.br</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
