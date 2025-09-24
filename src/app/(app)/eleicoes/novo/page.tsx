'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function NovaEleicaoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Formata a data no padrão que a API espera (YYYY-MM-DD HH:mm:ss)
      const payload = {
        nome: data.nome,
        data_inicio: format(data.dataInicio, "yyyy-MM-dd'T'HH:mm:ss"),
        data_fim: format(data.dataFim, "yyyy-MM-dd'T'HH:mm:ss"),
        id_urna: parseInt(data.urnaId),
      };

      await api.post('/v1/eleicoes', payload);

      toast({
        title: 'Eleição Criada',
        description: 'A nova eleição foi criada com sucesso.',
      });
      router.push('/eleicoes');
      router.refresh();
    } catch (error: any) {
      console.error('Erro ao criar eleição:', error);
      const apiError = error.response?.data?.message || 'Não foi possível criar a eleição. Verifique os dados e tente novamente.';
      toast({
        title: 'Erro ao Criar',
        description: apiError,
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
