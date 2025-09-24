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
          const response = await api.get(`/v1/candidatos/${candidatoId}`);
          setCandidato(response.data);
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


  const handleSubmit = async (data: FormData) => {
    try {
        await api.put(`/v1/candidatos/${candidatoId}`, data, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        toast({
            title: 'Candidato Atualizado',
            description: 'Os dados do candidato foram atualizados com sucesso.',
        });
        router.push('/candidatos');
        router.refresh();
    } catch (error) {
        console.error('Erro ao atualizar candidato:', error);
        toast({
            title: 'Erro ao Atualizar',
            description: 'Não foi possível atualizar o candidato.',
            variant: 'destructive',
        });
    }
  };
  
  if (!candidato) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." backHref="/candidatos"/>
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
      <CandidatoForm onSubmit={handleSubmit} defaultValues={candidato} isEditing />
    </div>
  );
}
