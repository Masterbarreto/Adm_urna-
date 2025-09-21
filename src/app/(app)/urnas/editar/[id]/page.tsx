'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import UrnaForm from '@/components/urna-form';
import type { Urna } from '@/lib/types';
import { mockUrnas } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function EditarUrnaPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [urna, setUrna] = useState<Urna | null>(null);

  const urnaId = params.id as string;

  useEffect(() => {
    const urnaParaEditar = mockUrnas.find((u) => u.id === urnaId) || null;
    setUrna(urnaParaEditar);
  }, [urnaId]);


  const handleSubmit = (data: Omit<Urna, 'id' | 'status' | 'ultimaAtividade'>) => {
    console.log('Urna atualizada:', { id: urnaId, ...data });
    toast({
      title: 'Urna Atualizada',
      description: 'Os dados da urna foram atualizados com sucesso.',
    });
    router.push('/urnas');
  };
  
  if (!urna) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." />
            <p>Carregando dados da urna...</p>
        </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Editar Urna"
        description="Atualize os dados da urna."
        backHref="/urnas"
      />
      <UrnaForm onSubmit={handleSubmit} defaultValues={urna} />
    </div>
  );
}
