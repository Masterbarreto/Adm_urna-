'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import EleicaoForm from '@/components/eleicao-form';
import { useToast } from '@/hooks/use-toast';

export default function NovaEleicaoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log('Nova eleição:', data);
    toast({
      title: 'Eleição Criada',
      description: 'A nova eleição foi criada com sucesso.',
    });
    router.push('/eleicoes');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Criar Nova Eleição"
        description="Preencha os dados para agendar uma nova eleição."
      />
      <EleicaoForm onSubmit={handleSubmit} />
    </div>
  );
}
