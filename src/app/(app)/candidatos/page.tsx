'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import Image from 'next/image';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCandidatos } from '@/lib/mock-data';
import type { Candidato } from '@/lib/types';

export default function CandidatosPage() {
  const [search, setSearch] = useState('');

  const filteredCandidatos = useMemo(() => {
    return mockCandidatos.filter(
      (c) =>
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.partido.toLowerCase().includes(search.toLowerCase()) ||
        c.numero.toString().includes(search)
    );
  }, [search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Candidatos"
        description="Adicione, edite e gerencie os candidatos para uma eleição."
      >
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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Candidato
        </Button>
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
                    <AvatarFallback>{candidato.nome.substring(0, 2)}</AvatarFallback>
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
      {/* TODO: Pagination */}
    </div>
  );
}
