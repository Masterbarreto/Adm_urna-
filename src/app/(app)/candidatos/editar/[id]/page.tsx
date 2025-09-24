'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import CandidatoForm from '@/components/candidato-form';
import type { Candidato } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function EditarCandidatoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [candidato, setCandidato] = useState<Candidato | null>(null);

  const candidatoId = params.id as string;

  useEffect(() => {
    if (candidatoId) {
      const fetchCandidato = async () => {
        try {
          // Sua API não tem um endpoint para buscar um candidato por ID,
          // então vamos buscar todos e filtrar.
          // O ideal seria ter um GET /candidatos/{id}
          const response = await api.get('/candidatos');
          const candidatoParaEditar = response.data.find((c: Candidato) => c.id === Number(candidatoId)) || null;
          setCandidato(candidatoParaEditar);
        } catch (error) {
          console.error("Erro ao buscar candidato:", error);
          toast({
            title: 'Erro ao carregar candidato',
            description: 'Não foi possível encontrar os dados do candidato.',
            variant: 'destructive',
          });
        }
      };
      fetchCandidato();
    }
  }, [candidatoId, toast]);


  const handleSubmit = async (data: Omit<Candidato, 'id' | 'eleicaoId'> & { eleicaoId: string }) => {
    // Sua API não tem um endpoint de atualização (PUT /candidatos/{id})
    // Adicione um no backend para esta funcionalidade operar.
    console.log('Candidato atualizado (simulação):', { id: candidatoId, ...data });
    toast({
      title: 'Funcionalidade Indisponível',
      description: 'A API não possui um endpoint para atualizar candidatos. Ação simulada.',
      variant: 'destructive'
    });
    router.push('/candidatos');
  };
  
  if (!candidato) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." />
            <p>Carregando dados do candidato...</p>
        </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Editar Candidato"
        description="Atualize os dados do candidato."
        backHref="/candidatos"
      />
      <CandidatoForm onSubmit={handleSubmit} defaultValues={candidato} />
    </div>
  );
}
