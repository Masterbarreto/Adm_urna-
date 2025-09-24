'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { Eleicao } from '@/lib/types';
import { formatISO } from 'date-fns';

export default function NovaEleicaoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        nome: data.nome,
        data_inicio: formatISO(data.dataInicio),
        data_fim: formatISO(data.dataFim),
        id_urna: parseInt(data.urnaId),
      };

      await api.post('/v1/eleicoes', payload);

      toast({
        title: 'Eleição Criada',
        description: 'A nova eleição foi criada com sucesso.',
      });
      router.push('/eleicoes');
      router.refresh();
    } catch (error) {
      console.error('Erro ao criar eleição:', error);
      toast({
        title: 'Erro ao Criar',
        description: 'Não foi possível criar a eleição. Verifique os dados e tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Criar Nova Eleição"
        description="Preencha os dados para agendar uma nova eleição."
        backHref="/eleicoes"
      />
      <EleicaoForm onSubmit={handleSubmit} />
    </div>
  );
}
