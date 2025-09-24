'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

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
import api from '@/lib/api';

export default function EleicoesPage() {
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eleicaoToDelete, setEleicaoToDelete] = useState<Eleicao | null>(null);
  const { toast } = useToast();

  async function fetchEleicoes() {
      try {
        setLoading(true);
        const response = await api.get('/eleicoes');
        setEleicoes(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar eleições:", error);
        toast({
          title: 'Erro ao carregar',
          description: 'Não foi possível buscar a lista de eleições.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchEleicoes();
  }, []);
  
  const handleDeleteClick = (eleicao: Eleicao) => {
    setEleicaoToDelete(eleicao);
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    if (eleicaoToDelete) {
      try {
        await api.delete(`/eleicoes/${eleicaoToDelete.id}`);
        toast({
          title: 'Eleição Removida',
          description: `A eleição "${eleicaoToDelete.nome}" foi removida.`,
        });
        fetchEleicoes();
      } catch(error) {
        console.error("Erro ao remover eleição:", error);
        toast({
          title: 'Erro ao remover',
          description: 'Não foi possível remover a eleição.',
          variant: 'destructive',
        });
      } finally {
        setShowDeleteDialog(false);
        setEleicaoToDelete(null);
      }
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
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Carregando eleições...
                    </TableCell>
                </TableRow>
            ) : eleicoes.length > 0 ? (
                eleicoes.map((eleicao) => (
                <TableRow key={eleicao.id}>
                    <TableCell className="font-medium">{eleicao.nome}</TableCell>
                    <TableCell>{format(new Date(eleicao.data_inicio), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>{format(new Date(eleicao.data_fim), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>{eleicao.id_urna}</TableCell>
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
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma eleição encontrada.
                    </TableCell>
                </TableRow>
            )}
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
