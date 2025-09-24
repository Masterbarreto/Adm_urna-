'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import CandidatoForm from '@/components/candidato-form';
import type { Candidato } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function NovoCandidatoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Candidato, 'id' | 'eleicaoId'> & { eleicaoId: string }) => {
    try {
      // Sua API espera `id_eleicao` e não `eleicaoId`
      const payload = {
        nome: data.nome,
        numero: data.numero,
        id_eleicao: data.eleicaoId,
        foto_url: data.fotoUrl,
      };

      // O endpoint de criação na sua API parece estar em /candidatos
      // O ideal seria enviar a imagem como multipart/form-data
      // mas vamos enviar a URL por enquanto
      await api.post('/candidatos', payload);
      
      toast({
        title: 'Candidato Criado',
        description: 'O novo candidato foi adicionado com sucesso.',
      });
      router.push('/candidatos');
      router.refresh(); // Força a atualização da lista
    } catch (error) {
      console.error('Erro ao criar candidato:', error);
      toast({
        title: 'Erro ao Criar',
        description: 'Não foi possível criar o candidato. Verifique os dados e tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Adicionar Novo Candidato"
        description="Preencha os dados para registrar um novo candidato."
      />
      <CandidatoForm onSubmit={handleSubmit} />
    </div>
  );
}
