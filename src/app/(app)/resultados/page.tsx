'use client';

import { useState, useEffect } from 'react';
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
import type { Eleicao } from '@/lib/types';
import ResultadosCharts from './charts';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

type ResultadoData = {
    totalVotos: number;
    votosNulos: number;
    votosBrancos: number;
    votosPorCandidato: { nome: string; votos: number }[];
}

export default function ResultadosPage() {
  const { toast } = useToast();
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  const [selectedEleicaoId, setSelectedEleicaoId] = useState<string>('');
  const [resultados, setResultados] = useState<ResultadoData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEleicoes() {
        try {
            const response = await api.get('/eleicoes');
            setEleicoes(response.data);
            if (response.data.length > 0) {
                setSelectedEleicaoId(String(response.data[0].id));
            }
        } catch (error) {
            console.error("Erro ao buscar eleições:", error);
            toast({ title: 'Erro', description: 'Não foi possível carregar as eleições.', variant: 'destructive' });
        }
    }
    fetchEleicoes();
  }, [toast]);

  useEffect(() => {
    async function fetchResultados() {
        if (!selectedEleicaoId) return;
        
        // A API não possui um endpoint para buscar resultados.
        // O ideal seria um GET /resultados/{eleicaoId}
        console.log(`Buscando resultados para a eleição ${selectedEleicaoId} (simulação)`);
        setLoading(true);
        // Simulando uma chamada de API
        setTimeout(() => {
            setResultados({
                totalVotos: 0,
                votosBrancos: 0,
                votosNulos: 0,
                votosPorCandidato: [],
            });
             toast({
                title: 'Funcionalidade Indisponível',
                description: 'A API não possui um endpoint para buscar os resultados da eleição.',
                variant: 'destructive',
            });
            setLoading(false);
        }, 1000);
    }
    fetchResultados();
  }, [selectedEleicaoId, toast]);


  const handleExport = () => {
    // Simulação de exportação
    toast({
      title: "Exportação (Simulada) Iniciada",
      description: "O seu relatório de resultados está sendo gerado e o download começará em breve.",
    });
    console.log("Exportando relatório...");
  }

  const statItems = [
    {
        title: 'Total de Votos',
        value: resultados?.totalVotos.toLocaleString('pt-BR') ?? '0',
        icon: Sigma,
    },
    {
        title: 'Votos Brancos',
        value: resultados?.votosBrancos.toLocaleString('pt-BR') ?? '0',
        icon: CircleSlash,
    },
    {
        title: 'Votos Nulos',
        value: resultados?.votosNulos.toLocaleString('pt-BR') ?? '0',
        icon: FileX,
    },
  ];

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
                {eleicoes.map(eleicao => (
                  <SelectItem key={eleicao.id} value={String(eleicao.id)}>{eleicao.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport} disabled={!selectedEleicaoId || loading}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
        </div>
      </PageHeader>
      <main>
        {loading ? (
             <Card>
                <CardContent className="py-24 text-center text-muted-foreground">
                    Carregando resultados...
                </CardContent>
            </Card>
        ) : selectedEleicaoId && resultados ? (
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
                    {resultados.votosPorCandidato.length > 0 ? (
                        <ResultadosCharts chartData={resultados.votosPorCandidato} />
                    ) : (
                        <Card>
                            <CardContent className="py-24 text-center text-muted-foreground">
                                Nenhum voto computado para os candidatos desta eleição ainda.
                            </CardContent>
                        </Card>
                    )}
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
