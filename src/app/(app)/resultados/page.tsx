'use client';

import { useState } from 'react';
import { Download, Sigma, FileX, CircleSlash } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockResultados, mockEleicoes } from '@/lib/mock-data';
import ResultadosCharts from './charts';
import { useToast } from '@/hooks/use-toast';

const statItems = [
  {
    title: 'Total de Votos',
    value: mockResultados.totalVotos.toLocaleString('pt-BR'),
    icon: Sigma,
  },
  {
    title: 'Votos Brancos',
    value: mockResultados.votosBrancos.toLocaleString('pt-BR'),
    icon: CircleSlash,
  },
  {
    title: 'Votos Nulos',
    value: mockResultados.votosNulos.toLocaleString('pt-BR'),
    icon: FileX,
  },
];

export default function ResultadosPage() {
  const { toast } = useToast();
  const [selectedEleicaoId, setSelectedEleicaoId] = useState<string>(mockEleicoes[0]?.id || '');

  const handleExport = () => {
    // Simulação de exportação
    toast({
      title: "Exportação Iniciada",
      description: "O seu relatório de resultados está sendo gerado e o download começará em breve.",
    });
    console.log("Exportando relatório...");
  }
  
  const selectedEleicao = mockEleicoes.find(e => e.id === selectedEleicaoId);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Resultados da Eleição"
        description="Visualize os resultados da eleição ativa em tempo real."
      >
        <div className="flex items-center gap-2">
            <Select value={selectedEleicaoId} onValueChange={setSelectedEleicaoId}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Selecione uma eleição" />
              </SelectTrigger>
              <SelectContent>
                {mockEleicoes.map(eleicao => (
                  <SelectItem key={eleicao.id} value={eleicao.id}>{eleicao.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
        </div>
      </PageHeader>
      <main>
        {selectedEleicao ? (
            <>
                <section className="grid gap-4 md:grid-cols-3">
                {statItems.map((item) => (
                    <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        {item.title}
                        </CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                    </CardContent>
                    </Card>
                ))}
                </section>
                <section className="mt-8">
                <ResultadosCharts />
                </section>
            </>
        ) : (
            <Card>
                <CardContent className="py-24 text-center text-muted-foreground">
                    Selecione uma eleição para ver os resultados.
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}
