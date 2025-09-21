'use client';

import { useState } from 'react';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { mockEleicoes } from '@/lib/mock-data';
import type { Eleicao } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function EleicoesPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eleicaoToDelete, setEleicaoToDelete] = useState<Eleicao | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const handleDeleteClick = (eleicao: Eleicao) => {
    setEleicaoToDelete(eleicao);
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = () => {
    if (eleicaoToDelete) {
      console.log('Removendo eleição:', eleicaoToDelete.id);
      // Aqui você chamaria a API para remover
      toast({
        title: 'Eleição Removida',
        description: `A eleição ${eleicaoToDelete.nome} foi removida com sucesso.`,
      });
      setShowDeleteDialog(false);
      setEleicaoToDelete(null);
      // Idealmente, você invalidaria o cache de dados aqui para forçar a atualização da lista
      router.refresh();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Eleições"
        description="Crie, edite e gerencie as eleições."
      >
        <Link href="/eleicoes/novo" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Eleição
          </Button>
        </Link>
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
                      <DropdownMenuItem asChild>
                         <Link href={`/eleicoes/editar/${eleicao.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4"/>
                            Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                         <Link href={`/eleicoes/${eleicao.id}/candidatos`} className="flex items-center">
                            <Users className="mr-2 h-4 w-4"/>
                            Gerenciar Candidatos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteClick(eleicao)} className="text-destructive focus:text-destructive flex items-center">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso removerá permanentemente a eleição
              <span className="font-bold"> {eleicaoToDelete?.nome} </span>
              dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
