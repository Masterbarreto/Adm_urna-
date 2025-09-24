'use client';

import { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
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
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Urna } from '@/lib/types';
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

export default function UrnasPage() {
  const [urnas, setUrnas] = useState<Urna[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [urnaToDelete, setUrnaToDelete] = useState<Urna | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchUrnas() {
      // Sua API não tem uma rota para buscar urnas, vamos simular
      // uma lista vazia. Crie um endpoint GET /urnas no backend.
      try {
        setLoading(true);
        // const response = await api.get('/urnas');
        // setUrnas(response.data);
        setUrnas([]); // Simulado
         toast({
          title: 'Funcionalidade Indisponível',
          description: 'A API não possui um endpoint para listar urnas. Exibindo lista vazia.',
          variant: 'destructive',
        });
      } catch (error) {
        console.error("Erro ao buscar urnas:", error);
        toast({
          title: 'Erro ao carregar',
          description: 'Não foi possível buscar a lista de urnas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUrnas();
  }, [toast]);
  
  const handleDeleteClick = (urna: Urna) => {
    setUrnaToDelete(urna);
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = () => {
    if (urnaToDelete) {
      // Sua API não tem um endpoint de deleção (DELETE /urnas/{id})
      console.log('Removendo urna (simulação):', urnaToDelete.id);
      toast({
        title: 'Funcionalidade Indisponível',
        description: `A API não possui um endpoint para remover urnas. Ação simulada.`,
        variant: 'destructive'
      });
      setShowDeleteDialog(false);
      setUrnaToDelete(null);
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Urnas"
        description="Gerencie a urna eletrônica do sistema."
      >
        <Link href="/urnas/novo" passHref>
            <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Urna
            </Button>
        </Link>
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
             {loading ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        Carregando urnas...
                    </TableCell>
                </TableRow>
            ) : urnas.length > 0 ? (
                urnas.map((urna) => (
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
                        <DropdownMenuItem asChild>
                            <Link href={`/urnas/editar/${urna.id}`} className="flex items-center">
                                <Edit className="mr-2 h-4 w-4"/>
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(urna)} className="text-destructive focus:text-destructive flex items-center">
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
                    <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma urna encontrada.
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
              Essa ação não pode ser desfeita. Isso removerá permanentemente a urna
              <span className="font-bold"> {urnaToDelete?.nome} </span>
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
