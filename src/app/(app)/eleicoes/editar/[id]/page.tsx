'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import type { Eleicao } from '@/lib/types';
import { mockEleicoes } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function EditarEleicaoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [eleicao, setEleicao] = useState<Eleicao | null>(null);

  const eleicaoId = params.id as string;

  useEffect(() => {
    const eleicaoParaEditar = mockEleicoes.find((e) => e.id === eleicaoId) || null;
    setEleicao(eleicaoParaEditar);
  }, [eleicaoId]);


  const handleSubmit = (data: any) => {
    console.log('Eleição atualizada:', { id: eleicaoId, ...data });
    toast({
      title: 'Eleição Atualizada',
      description: 'Os dados da eleição foram atualizados com sucesso.',
    });
    router.push('/eleicoes');
  };
  
  if (!eleicao) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." />
            <p>Carregando dados da eleição...</p>
        </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Editar Eleição"
        description="Atualize os dados da eleição."
        backHref="/eleicoes"
      />
      <EleicaoForm onSubmit={handleSubmit} defaultValues={eleicao} />
    </div>
  );
}
