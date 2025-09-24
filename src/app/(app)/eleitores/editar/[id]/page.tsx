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
          const response = await api.get(`/v1/eleitores/${eleitorId}`);
          setEleitor(response.data);
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
    try {
        const payload = {
            ...data,
            cpf: data.cpf.replace(/\D/g, ''), // Garante que apenas dígitos são enviados
        };
        await api.put(`/v1/eleitores/${eleitorId}`, payload);
        toast({
            title: 'Eleitor Atualizado',
            description: 'Os dados do eleitor foram atualizados com sucesso.',
        });
        router.push('/eleitores');
        router.refresh();
    } catch(error) {
        console.error('Erro ao atualizar eleitor:', error);
        toast({
            title: 'Erro ao Atualizar',
            description: 'Não foi possível atualizar os dados do eleitor.',
            variant: 'destructive'
        });
    }
  };
  
  if (!eleitor) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." backHref="/eleitores" />
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
