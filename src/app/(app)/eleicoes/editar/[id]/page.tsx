'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import type { Eleicao } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function EditarEleicaoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [eleicao, setEleicao] = useState<Eleicao | null>(null);

  const eleicaoId = params.id as string;

  useEffect(() => {
    if (eleicaoId) {
      const fetchEleicao = async () => {
         try {
          // Sua API não tem um endpoint para buscar uma eleição por ID,
          // então vamos buscar todas e filtrar.
          // O ideal seria ter um GET /eleicoes/{id}
          const response = await api.get('/eleicoes');
          const eleicaoParaEditar = response.data.find((e: Eleicao) => e.id === Number(eleicaoId)) || null;
          setEleicao(eleicaoParaEditar);
        } catch (error) {
          console.error("Erro ao buscar eleição:", error);
          toast({
            title: 'Erro ao carregar eleição',
            description: 'Não foi possível encontrar os dados da eleição.',
            variant: 'destructive',
          });
        }
      }
      fetchEleicao();
    }
  }, [eleicaoId, toast]);


  const handleSubmit = async (data: any) => {
    // Sua API não tem um endpoint de atualização (PUT /eleicoes/{id})
    // Adicione um no backend para esta funcionalidade operar.
    console.log('Eleição atualizada (simulação):', { id: eleicaoId, ...data });
    toast({
      title: 'Funcionalidade Indisponível',
      description: 'A API não possui um endpoint para atualizar eleições. Ação simulada.',
      variant: 'destructive'
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
