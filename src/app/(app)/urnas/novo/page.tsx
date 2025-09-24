'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import UrnaForm from '@/components/urna-form';
import type { Urna } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function NovaUrnaPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Urna, 'id' | 'status' | 'ultimaAtividade'>) => {
    try {
      await api.post('/v1/urnas', data);
      
      toast({
        title: 'Urna Criada',
        description: 'A nova urna foi registrada com sucesso.',
      });
      router.push('/urnas');
      router.refresh();
    } catch(error) {
        console.error('Erro ao criar urna:', error);
        toast({
            title: 'Erro ao Criar',
            description: 'Não foi possível criar a urna.',
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Adicionar Nova Urna"
        description="Preencha os dados para registrar uma nova urna."
        backHref="/urnas"
      />
      <UrnaForm onSubmit={handleSubmit} />
    </div>
  );
}
