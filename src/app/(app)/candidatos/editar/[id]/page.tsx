'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import CandidatoForm from '@/components/candidato-form';
import type { Candidato } from '@/lib/types';
import { mockCandidatos } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function EditarCandidatoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [candidato, setCandidato] = useState<Candidato | null>(null);

  const candidatoId = params.id as string;

  useEffect(() => {
    const candidatoParaEditar = mockCandidatos.find((c) => c.id === candidatoId) || null;
    setCandidato(candidatoParaEditar);
  }, [candidatoId]);


  const handleSubmit = (data: Omit<Candidato, 'id' | 'eleicaoId'> & { eleicaoId: string }) => {
    console.log('Candidato atualizado:', { id: candidatoId, ...data });
    toast({
      title: 'Candidato Atualizado',
      description: 'Os dados do candidato foram atualizados com sucesso.',
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
      />
      <CandidatoForm onSubmit={handleSubmit} defaultValues={candidato} />
    </div>
  );
}
