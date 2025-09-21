'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import UrnaForm from '@/components/urna-form';
import type { Urna } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function NovaUrnaPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Urna, 'id' | 'status' | 'ultimaAtividade'>) => {
    console.log('Nova urna:', data);
    toast({
      title: 'Urna Criada',
      description: 'A nova urna foi adicionada com sucesso.',
    });
    router.push('/urnas');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Adicionar Nova Urna"
        description="Preencha os dados para registrar uma nova urna."
      />
      <UrnaForm onSubmit={handleSubmit} />
    </div>
  );
}
