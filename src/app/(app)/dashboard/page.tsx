import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PageHeader from '@/components/page-header';
import {
  History,
  PieChart,
  Server,
  Users,
  User,
  Vote,
  VoteIcon,
  Wifi,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const statItems = [
  {
    title: 'Status da Urna',
    value: 'Ativa',
    icon: CheckCircle,
    color: 'text-success',
  },
  {
    title: 'Conexão da Urna',
    value: 'Online',
    icon: Wifi,
    color: 'text-accent',
  },
  {
    title: 'Total de Votos',
    value: '1,234',
    icon: VoteIcon,
    color: 'text-foreground',
  },
];

const navItems = [
    { href: '/urnas', icon: Server, label: 'Urnas', description: 'Gerencie a urna eletrônica' },
    { href: '/eleicoes', icon: Vote, label: 'Eleições', description: 'Crie e configure eleições' },
    { href: '/candidatos', icon: Users, label: 'Candidatos', description: 'Adicione e edite candidatos' },
    { href: '/eleitores', icon: User, label: 'Eleitores', description: 'Gerencie a lista de eleitores' },
    { href: '/resultados', icon: PieChart, label: 'Resultados', description: 'Visualize os resultados' },
    { href: '/auditoria', icon: History, label: 'Logs de Auditoria', description: 'Acompanhe todas as ações' },
];

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Visão Geral"
        description="Painel de controle com o status geral do sistema de votação."
      />
      <main>
        <section className="grid gap-4 md:grid-cols-3">
          {statItems.map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Gerenciamento</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {navItems.map((item) => (
                <Link href={item.href} key={item.href} className="group block rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <Card>
                        <CardHeader className="flex flex-row items-start gap-4 p-4">
                            <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{item.label}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </CardHeader>
                    </Card>
                    </Link>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
}
