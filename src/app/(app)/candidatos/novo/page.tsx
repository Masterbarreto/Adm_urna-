'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import CandidatoForm from '@/components/candidato-form';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { CandidatoFormValues } from '@/components/candidato-form';

export default function NovoCandidatoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: CandidatoFormValues) => {
    try {
      // Se houver uma foto (que é um objeto File), use FormData.
      if (data.foto && typeof data.foto === 'object') {
        const formData = new FormData();
        formData.append('nome', data.nome);
        formData.append('numero', String(data.numero));
        if(data.partido) formData.append('partido', data.partido);
        formData.append('id_eleicao', data.id_eleicao);
        formData.append('foto', data.foto);
        
        await api.post('/v1/candidatos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Caso contrário, envie como JSON.
        const payload = {
            nome: data.nome,
            numero: data.numero,
            partido: data.partido,
            id_eleicao: data.id_eleicao
        };
        await api.post('/v1/candidatos', payload);
      }
      
      toast({
        title: 'Candidato Criado',
        description: 'O novo candidato foi adicionado com sucesso.',
      });
      router.push('/candidatos');
      router.refresh();
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
        backHref="/candidatos"
      />
      <CandidatoForm onSubmit={handleSubmit} />
    </div>
  );
}
