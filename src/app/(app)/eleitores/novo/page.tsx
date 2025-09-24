'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleitorForm from '@/components/eleitor-form';
import type { Eleitor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function NovoEleitorPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Eleitor, 'id'>) => {
    try {
      await api.post('/eleitores', data);
      toast({
        title: 'Eleitor Criado',
        description: 'O novo eleitor foi adicionado com sucesso.',
      });
      router.push('/eleitores');
      router.refresh();
    } catch (error) {
      console.error('Erro ao criar eleitor:', error);
      toast({
        title: 'Erro ao Criar',
        description: 'Não foi possível adicionar o eleitor. Verifique os dados.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Adicionar Novo Eleitor"
        description="Preencha os dados para registrar um novo eleitor."
      />
      <EleitorForm onSubmit={handleSubmit} />
    </div>
  );
}
