'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import CandidatoForm from '@/components/candidato-form';
import type { Candidato } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function NovoCandidatoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Candidato, 'id' | 'eleicaoId'> & { eleicaoId: string }) => {
    console.log('Novo candidato:', data);
    toast({
      title: 'Candidato Criado',
      description: 'O novo candidato foi adicionado com sucesso.',
    });
    router.push('/candidatos');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Adicionar Novo Candidato"
        description="Preencha os dados para registrar um novo candidato."
      />
      <CandidatoForm onSubmit={handleSubmit} />
    </div>
  );
}
