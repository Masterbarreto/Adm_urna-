'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, PlusCircle, Search, Upload, Trash2, Edit } from 'lucide-react';
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockEleitores } from '@/lib/mock-data';
import type { Eleitor } from '@/lib/types';
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
import { useRouter } from 'next/navigation';

export default function EleitoresPage() {
  const [search, setSearch] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eleitorToDelete, setEleitorToDelete] = useState<Eleitor | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const filteredEleitores = useMemo(() => {
    return mockEleitores.filter(
      (e) =>
        e.nome.toLowerCase().includes(search.toLowerCase()) ||
        e.cpf.includes(search) ||
        e.tituloEleitor.includes(search)
    );
  }, [search]);
  
  const handleDeleteClick = (eleitor: Eleitor) => {
    setEleitorToDelete(eleitor);
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = () => {
    if (eleitorToDelete) {
      console.log('Removendo eleitor:', eleitorToDelete.id);
      // Aqui você chamaria a API para remover
      toast({
        title: 'Eleitor Removido',
        description: `O eleitor ${eleitorToDelete.nome} foi removido com sucesso.`,
      });
      setShowDeleteDialog(false);
      setEleitorToDelete(null);
      // Idealmente, você invalidaria o cache de dados aqui para forçar a atualização da lista
      router.refresh();
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Eleitores"
        description="Gerencie a lista de eleitores autorizados a votar."
      >
        <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar eleitor..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/eleitores/importar" passHref>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar
                </Button>
            </Link>
            <Link href="/eleitores/novo" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Eleitor
                </Button>
            </Link>
        </div>
      </PageHeader>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Título de Eleitor</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEleitores.slice(0, 10).map((eleitor: Eleitor) => ( // Limiting to 10 for display
              <TableRow key={eleitor.id}>
                <TableCell className="font-medium">{eleitor.nome}</TableCell>
                <TableCell>{eleitor.cpf}</TableCell>
                <TableCell>{eleitor.tituloEleitor}</TableCell>
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
                         <Link href={`/eleitores/editar/${eleitor.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4"/>
                            Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteClick(eleitor)} className="text-destructive focus:text-destructive flex items-center">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {filteredEleitores.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum eleitor encontrado.
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
              Essa ação não pode ser desfeita. Isso removerá permanentemente o eleitor
              <span className="font-bold"> {eleitorToDelete?.nome} </span>
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
