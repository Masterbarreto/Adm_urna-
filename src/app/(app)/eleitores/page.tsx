'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, PlusCircle, Search, Upload } from 'lucide-react';
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
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockEleitores } from '@/lib/mock-data';
import type { Eleitor } from '@/lib/types';

export default function EleitoresPage() {
  const [search, setSearch] = useState('');

  const filteredEleitores = useMemo(() => {
    return mockEleitores.filter(
      (e) =>
        e.nome.toLowerCase().includes(search.toLowerCase()) ||
        e.cpf.includes(search) ||
        e.tituloEleitor.includes(search)
    );
  }, [search]);

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
            <Link href="/eleitores/importar">
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar
                </Button>
            </Link>
            <Link href="/eleitores/novo">
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
                      <Link href={`/eleitores/editar/${eleitor.id}`}>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">Remover</DropdownMenuItem>
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
      {/* TODO: Pagination */}
    </div>
  );
}
