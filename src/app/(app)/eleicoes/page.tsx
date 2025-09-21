import { MoreHorizontal, PlusCircle } from 'lucide-react';
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
import { Card } from '@/components/ui/card';
import { mockEleicoes } from '@/lib/mock-data';

export default function EleicoesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Eleições"
        description="Crie, edite e gerencie as eleições."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Eleição
        </Button>
      </PageHeader>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Eleição</TableHead>
              <TableHead>Data de Início</TableHead>
              <TableHead>Data de Fim</TableHead>
              <TableHead>Urna Associada</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEleicoes.map((eleicao) => (
              <TableRow key={eleicao.id}>
                <TableCell className="font-medium">{eleicao.nome}</TableCell>
                <TableCell>{format(new Date(eleicao.dataInicio), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>{format(new Date(eleicao.dataFim), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>{eleicao.urnaId}</TableCell>
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
                      <DropdownMenuItem>Gerenciar Candidatos</DropdownMenuItem>
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
