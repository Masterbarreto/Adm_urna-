'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlusCircle, Search, UserX } from 'lucide-react';

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
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Candidato, Eleicao } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import api from '@/lib/api';

export default function GerenciarCandidatosEleicaoPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eleicaoId = params.id as string;

  const [eleicao, setEleicao] = useState<Eleicao | null>(null);
  const [allCandidatos, setAllCandidatos] = useState<Candidato[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [associatedCandidateIds, setAssociatedCandidateIds] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchEleicaoEChandidatos = async () => {
        try {
            // O ideal seria um endpoint /eleicoes/{id} que já retorna os candidatos
            const [eleicaoRes, candidatosRes] = await Promise.all([
                api.get('/eleicoes'), // Não há GET /eleicoes/{id}, então buscamos todos
                api.get('/candidatos')
            ]);
            
            const currentEleicao = eleicaoRes.data.find((e: Eleicao) => e.id === Number(eleicaoId)) || null;
            
            if (currentEleicao) {
                setEleicao(currentEleicao);
                setAllCandidatos(candidatosRes.data);
                // Sua API não parece retornar os candidatos associados a uma eleição.
                // Simulando que os candidatos têm uma `eleicaoId`
                const initialCandidates = candidatosRes.data
                    .filter((c: Candidato) => c.eleicaoId === Number(eleicaoId))
                    .map((c: Candidato) => c.id);
                setAssociatedCandidateIds(initialCandidates);
            } else {
                toast({ title: 'Erro', description: 'Eleição não encontrada.', variant: 'destructive' });
                router.push('/eleicoes');
            }
        } catch (error) {
            console.error("Erro ao buscar dados da eleição:", error);
            toast({ title: 'Erro', description: 'Não foi possível carregar os dados da eleição.', variant: 'destructive' });
        }
    };
    if(eleicaoId) {
        fetchEleicaoEChandidatos();
    }
  }, [eleicaoId, router, toast]);

  const associatedCandidates = useMemo(() => {
    return allCandidatos.filter(c => associatedCandidateIds.includes(c.id));
  }, [associatedCandidateIds, allCandidatos]);
  
  const filteredAssociatedCandidates = useMemo(() => {
     return associatedCandidates.filter(
      (c) =>
        c.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, associatedCandidates]);


  const availableCandidates = useMemo(() => {
    return allCandidatos.filter(c => !associatedCandidateIds.includes(c.id));
  }, [associatedCandidateIds, allCandidatos]);

  const handleRemoveCandidate = (candidateId: number) => {
    // Falta endpoint na API para desassociar candidato
    setAssociatedCandidateIds(ids => ids.filter(id => id !== candidateId));
    toast({ title: 'Candidato Desvinculado (Simulação)', description: 'O candidato foi removido desta eleição.' });
  };
  
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');

  const handleAddCandidate = () => {
    // Falta endpoint na API para associar candidato
    const candidateIdNum = Number(selectedCandidate);
    if(candidateIdNum && !associatedCandidateIds.includes(candidateIdNum)){
        setAssociatedCandidateIds(ids => [...ids, candidateIdNum]);
        toast({ title: 'Candidato Adicionado (Simulação)', description: 'O candidato foi adicionado à eleição.' });
    }
    setSelectedCandidate('');
    setIsModalOpen(false);
  }

  if (!eleicao) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={`Gerenciar Candidatos: ${eleicao.nome}`}
        description="Associe ou desassocie candidatos para esta eleição."
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar candidato na lista..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Candidato
          </Button>
        </div>
      </PageHeader>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Número</TableHead>
              <TableHead className="w-[80px] text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssociatedCandidates.map((candidato: Candidato) => (
              <TableRow key={candidato.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={candidato.fotoUrl} alt={candidato.nome} />
                    <AvatarFallback>{candidato.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{candidato.nome}</TableCell>
                <TableCell>{candidato.numero}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCandidate(candidato.id)}>
                    <UserX className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {filteredAssociatedCandidates.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum candidato associado a esta eleição.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Adicionar Candidato à Eleição</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <Select onValueChange={setSelectedCandidate} value={selectedCandidate}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um candidato para adicionar" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCandidates.length > 0 ? (
                            availableCandidates.map(c => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.nome}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-4 text-sm text-muted-foreground">Todos os candidatos já foram adicionados.</div>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleAddCandidate} disabled={!selectedCandidate}>Adicionar</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
