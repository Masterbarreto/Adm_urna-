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
  const [loading, setLoading] = useState(true);

  const urnaId = params.id as string;

  useEffect(() => {
    if (urnaId) {
       const fetchUrna = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/urnas/${urnaId}`);
          setUrna(response.data);
        } catch (error) {
          console.error("Erro ao buscar urna:", error);
          toast({
            title: 'Erro ao carregar urna',
            description: 'Não foi possível encontrar os dados da urna.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUrna();
    }
  }, [urnaId, toast]);


  const handleSubmit = async (data: Omit<Urna, 'id' | 'status' | 'ultimaAtividade'>) => {
    try {
      await api.put(`/urnas/${urnaId}`, data);
      toast({
        title: 'Urna Atualizada',
        description: 'Os dados da urna foram atualizados com sucesso.'
      });
      router.push('/urnas');
      router.refresh();
    } catch(error) {
       console.error("Erro ao atualizar urna:", error);
       toast({
          title: 'Erro ao atualizar',
          description: 'Não foi possível atualizar os dados da urna.',
          variant: 'destructive'
        });
    }
  };
  
  if (loading) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Carregando..." backHref="/urnas" />
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
      <UrnaForm onSubmit={handleSubmit} defaultValues={urna!} />
    </div>
  );
}
