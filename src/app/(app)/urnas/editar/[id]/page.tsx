'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import UrnaForm from '@/components/urna-form';
import type { Urna } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function EditarUrnaPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [urna, setUrna] = useState<Urna | null>(null);

  const urnaId = params.id as string;

  useEffect(() => {
    if (urnaId) {
       const fetchUrna = async () => {
        try {
          // Sua API não tem um endpoint para buscar uma urna por ID,
          // então vamos buscar todas e filtrar.
          // O ideal seria ter um GET /urnas/{id}
          const response = await api.get('/urnas');
          const urnaParaEditar = response.data.find((u: Urna) => u.id === Number(urnaId)) || null;
          setUrna(urnaParaEditar);
        } catch (error) {
          console.error("Erro ao buscar urna:", error);
          toast({
            title: 'Erro ao carregar urna',
            description: 'Não foi possível encontrar os dados da urna.',
            variant: 'destructive',
          });
        }
      };
      fetchUrna();
    }
  }, [urnaId, toast]);


  const handleSubmit = (data: Omit<Urna, 'id' | 'status' | 'ultimaAtividade'>) => {
    // Sua API não tem um endpoint de atualização (PUT /urnas/{id})
    // Adicione um no backend para esta funcionalidade operar.
    console.log('Urna atualizada (simulação):', { id: urnaId, ...data });
    toast({
      title: 'Funcionalidade Indisponível',
      description: 'A API não possui um endpoint para atualizar urnas. Ação simulada.',
      variant: 'destructive'
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
