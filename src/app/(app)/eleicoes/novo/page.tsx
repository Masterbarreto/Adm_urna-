'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function NovaEleicaoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Ajustando o payload para o que a sua API espera
      const payload = {
        nome: data.nome,
        data_inicio: data.dataInicio,
        data_fim: data.dataFim,
        id_urna: data.urnaId,
        // O campo `candidatoIds` não parece ser aceito pela sua API na criação da eleição
      };

      await api.post('/eleicoes', payload);

      toast({
        title: 'Eleição Criada',
        description: 'A nova eleição foi criada com sucesso.',
      });
      router.push('/eleicoes');
      router.refresh(); // Força a atualização da lista de eleições
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
      />
      <EleicaoForm onSubmit={handleSubmit} />
    </div>
  );
}
