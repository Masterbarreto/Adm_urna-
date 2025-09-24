'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import type { Eleicao } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatISO } from 'date-fns';

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
          const response = await api.get(`/eleicoes/${eleicaoId}`);
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
        data_inicio: formatISO(data.dataInicio),
        data_fim: formatISO(data.dataFim),
        id_urna: parseInt(data.urnaId),
      };

      await api.put(`/eleicoes/${eleicaoId}`, payload);

      toast({
        title: 'Eleição Atualizada',
        description: 'Os dados da eleição foram atualizados com sucesso.'
      });
      router.push('/eleicoes');
      router.refresh();
    } catch(error) {
      console.error("Erro ao atualizar eleição:", error);
       toast({
          title: 'Erro ao atualizar',
          description: 'Não foi possível atualizar os dados da eleição.',
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
