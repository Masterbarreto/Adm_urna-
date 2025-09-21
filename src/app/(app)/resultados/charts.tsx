'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
  ChartStyle,
} from '@/components/ui/chart';
import { mockResultados } from '@/lib/mock-data';
import { PieChart as PieChartComponent } from 'recharts';

const chartData = mockResultados.votosPorCandidato;

const chartConfig = {
  votos: {
    label: 'Votos',
  },
  'Fulano de Tal': {
    label: 'Fulano de Tal',
    color: 'hsl(var(--chart-1))',
  },
  'Ciclana da Silva': {
    label: 'Ciclana da Silva',
    color: 'hsl(var(--chart-2))',
  },
  'Beltrano Souza': {
    label: 'Beltrano Souza',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function ResultadosCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Votos por Candidato</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChartComponent>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="votos"
                nameKey="nome"
                innerRadius={60}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartConfig[entry.nome as keyof typeof chartConfig]?.color}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="nome" />}
                className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChartComponent>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Votos por Candidato</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="nome"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="votos" radius={8}>
                 {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartConfig[entry.nome as keyof typeof chartConfig]?.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
