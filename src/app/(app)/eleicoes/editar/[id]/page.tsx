'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import type { Eleicao } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';

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
          const response = await api.get(`/v1/eleicoes/${eleicaoId}`);
          setEleicao(response.data);
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
    try {
      const payload = {
        nome: data.nome,
        data_inicio: format(data.dataInicio, "yyyy-MM-dd'T'HH:mm:ss"),
        data_fim: format(data.dataFim, "yyyy-MM-dd'T'HH:mm:ss"),
        id_urna: parseInt(data.urnaId),
      };

      await api.put(`/v1/eleicoes/${eleicaoId}`, payload);

      toast({
        title: 'Eleição Atualizada',
        description: 'Os dados da eleição foram atualizados com sucesso.'
      });
      router.push('/eleicoes');
      router.refresh();
    } catch(error: any) {
      console.error("Erro ao atualizar eleição:", error);
       const apiError = error.response?.data?.message || 'Não foi possível atualizar os dados da eleição.';
       toast({
          title: 'Erro ao atualizar',
          description: apiError,
          variant: 'destructive'
        });
    }
  };
  
  if (!eleicao) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." backHref="/eleicoes"/>
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
