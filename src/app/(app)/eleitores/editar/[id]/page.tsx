'use client';

import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleitorForm from '@/components/eleitor-form';
import type { Eleitor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function EditarEleitorPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [eleitor, setEleitor] = useState<Eleitor | null>(null);

  const eleitorId = params.id as string;

  useEffect(() => {
    if (eleitorId) {
      const fetchEleitor = async () => {
        try {
          // Sua API não tem um endpoint para buscar um eleitor por ID,
          // então vamos buscar todos e filtrar.
          // O ideal seria ter um GET /eleitores/{id}
          const response = await api.get('/eleitores');
          const eleitorParaEditar = response.data.find((e: Eleitor) => e.id === Number(eleitorId)) || null;
          setEleitor(eleitorParaEditar);
        } catch (error) {
          console.error("Erro ao buscar eleitor:", error);
          toast({
            title: 'Erro ao carregar eleitor',
            description: 'Não foi possível encontrar os dados do eleitor.',
            variant: 'destructive',
          });
        }
      }
      fetchEleitor();
    }
  }, [eleitorId, toast]);


  const handleSubmit = async (data: Omit<Eleitor, 'id'>) => {
    // Sua API não tem um endpoint de atualização (PUT /eleitores/{id})
    // Adicione um no backend para esta funcionalidade operar.
    console.log('Eleitor atualizado (simulação):', { id: eleitorId, ...data });
    toast({
      title: 'Funcionalidade Indisponível',
      description: 'A API não possui um endpoint para atualizar eleitores. Ação simulada.',
      variant: 'destructive'
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
