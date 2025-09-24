
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
            const response = await api.get('/v1/eleicoes');
            setEleicoes(response.data.data);
            if (response.data.data.length > 0) {
                // Seleciona a primeira eleição por padrão
                setSelectedEleicaoId(String(response.data.data[0].id));
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
        
        setLoading(true);
        try {
            const response = await api.get(`/v1/resultados/${selectedEleicaoId}`);
            setResultados(response.data);
        } catch (error) {
            console.error(`Erro ao buscar resultados para a eleição ${selectedEleicaoId}:`, error);
            toast({
                title: 'Erro ao buscar resultados',
                description: 'Não foi possível carregar os dados para esta eleição.',
                variant: 'destructive',
            });
            setResultados(null); // Limpa resultados anteriores em caso de erro
        } finally {
            setLoading(false);
        }
    }
    fetchResultados();
  }, [selectedEleicaoId, toast]);


  const handleExport = async () => {
    if(!selectedEleicaoId) return;
    try {
        const response = await api.get(`/v1/resultados/${selectedEleicaoId}/exportar`, {
            responseType: 'blob', // Importante para lidar com arquivos
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const eleicao = eleicoes.find(e => e.id === Number(selectedEleicaoId));
        const fileName = `resultados_${eleicao?.nome.replace(/\s+/g, '_') || selectedEleicaoId}.csv`;
        
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast({
            title: "Exportação Iniciada",
            description: "O seu relatório de resultados começou a ser baixado.",
        });
    } catch(error) {
        console.error("Erro ao exportar relatório:", error);
        toast({
            title: "Erro na Exportação",
            description: "Não foi possível gerar o relatório.",
            variant: 'destructive',
        });
    }
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
            <Select value={selectedEleicaoId} onValueChange={setSelectedEleicaoId} disabled={eleicoes.length === 0}>
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
                    {eleicoes.length > 0 ? 'Selecione uma eleição para ver os resultados.' : 'Nenhuma eleição encontrada.'}
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}

    