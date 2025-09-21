'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCandidatos } from '@/lib/mock-data';
import type { Candidato } from '@/lib/types';
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

export default function CandidatosPage() {
  const [search, setSearch] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidato | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  const filteredCandidatos = useMemo(() => {
    return mockCandidatos.filter(
      (c) =>
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.partido.toLowerCase().includes(search.toLowerCase()) ||
        c.numero.toString().includes(search)
    );
  }, [search]);

  const handleDeleteClick = (candidato: Candidato) => {
    setCandidateToDelete(candidato);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (candidateToDelete) {
      console.log('Removendo candidato:', candidateToDelete.id);
      // Aqui você chamaria a API para remover
      toast({
        title: 'Candidato Removido',
        description: `O candidato ${candidateToDelete.nome} foi removido com sucesso.`,
      });
      setShowDeleteDialog(false);
      setCandidateToDelete(null);
      // Idealmente, você invalidaria o cache de dados aqui para forçar a atualização da lista
      router.refresh(); 
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Candidatos"
        description="Adicione, edite e gerencie os candidatos para uma eleição."
      >
        <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar candidato..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/candidatos/novo" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Candidato
              </Button>
            </Link>
        </div>
      </PageHeader>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Partido</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidatos.map((candidato: Candidato) => (
              <TableRow key={candidato.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={candidato.fotoUrl} alt={candidato.nome} data-ai-hint="person portrait" />
                    <AvatarFallback>{candidato.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{candidato.nome}</TableCell>
                <TableCell>{candidato.numero}</TableCell>
                <TableCell>{candidato.partido}</TableCell>
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
                         <Link href={`/candidatos/editar/${candidato.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4"/>
                            Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteClick(candidato)} className="text-destructive focus:text-destructive flex items-center">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredCandidatos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum candidato encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {/* TODO: Pagination */}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso removerá permanentemente o candidato
              <span className="font-bold"> {candidateToDelete?.nome} </span>
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
