import {
  MoreHorizontal,
  PlusCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockUrnas } from '@/lib/mock-data';

export default function UrnasPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Urnas"
        description="Gerencie a urna eletrônica do sistema."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Urna
        </Button>
      </PageHeader>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID da Urna</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUrnas.map((urna) => (
              <TableRow key={urna.id}>
                <TableCell className="font-medium">{urna.id}</TableCell>
                <TableCell>{urna.nome}</TableCell>
                <TableCell>{urna.local}</TableCell>
                <TableCell>
                  <Badge variant={urna.status === 'online' ? 'success' : 'destructive'}>
                      {urna.status === 'online' ? <CheckCircle className="mr-1.5 h-4 w-4" /> : <XCircle className="mr-1.5 h-4 w-4" />}
                      {urna.status === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(urna.ultimaAtividade), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">Remover</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
