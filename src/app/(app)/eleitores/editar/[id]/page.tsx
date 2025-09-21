'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleitorForm from '@/components/eleitor-form';
import type { Eleitor } from '@/lib/types';
import { mockEleitores } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function EditarEleitorPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [eleitor, setEleitor] = useState<Eleitor | null>(null);

  const eleitorId = params.id as string;

  useEffect(() => {
    const eleitorParaEditar = mockEleitores.find((e) => e.id === eleitorId) || null;
    setEleitor(eleitorParaEditar);
  }, [eleitorId]);


  const handleSubmit = (data: Omit<Eleitor, 'id'>) => {
    // Here you would typically call an API to update the data
    console.log('Eleitor atualizado:', { id: eleitorId, ...data });
    toast({
      title: 'Eleitor Atualizado',
      description: 'Os dados do eleitor foram atualizados com sucesso.',
    });
    router.push('/eleitores');
  };
  
  if (!eleitor) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." />
            <p>Carregando dados do eleitor...</p>
        </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Editar Eleitor"
        description="Atualize os dados do eleitor."
        backHref="/eleitores"
      />
      <EleitorForm onSubmit={handleSubmit} defaultValues={eleitor} />
    </div>
  );
}
