'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import CandidatoForm from '@/components/candidato-form';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function NovoCandidatoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    try {
      await api.post('/candidatos', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
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
