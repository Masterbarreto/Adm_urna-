'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleitorForm from '@/components/eleitor-form';
import type { Eleitor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function NovoEleitorPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Eleitor, 'id'>) => {
    // Here you would typically call an API to save the data
    console.log('Novo eleitor:', data);
    toast({
      title: 'Eleitor Criado',
      description: 'O novo eleitor foi adicionado com sucesso.',
    });
    router.push('/eleitores');
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
