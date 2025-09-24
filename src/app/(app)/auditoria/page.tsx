'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { Log } from '@/lib/types';
import api from '@/lib/api';

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [actionFilter, setActionFilter] = useState('all');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const response = await api.get('/v1/auditoria');
        setLogs(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar logs de auditoria:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);
  
  const actionTypes = useMemo(() => {
      if(logs.length === 0) return [];
      return [...new Set(logs.map(log => log.acao))];
  }, [logs]);


  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const actionMatch = actionFilter === 'all' || log.acao === actionFilter;
      const dateMatch = !date || new Date(log.data).toDateString() === date.toDateString();
      return actionMatch && dateMatch;
    });
  }, [actionFilter, date, logs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Logs de Auditoria"
        description="Acompanhe todas as ações e eventos importantes do sistema."
      >
        <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className="w-[240px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Ação" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as Ações</SelectItem>
                    {actionTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </PageHeader>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        Carregando logs...
                    </TableCell>
                </TableRow>
            ) : Array.isArray(filteredLogs) && filteredLogs.length > 0 ? (
                filteredLogs.map((log: Log) => (
                    <TableRow key={log.id}>
                        <TableCell>{format(new Date(log.data), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</TableCell>
                        <TableCell><span className="font-mono text-sm">{log.acao}</span></TableCell>
                        <TableCell>{log.usuario.nome}</TableCell>
                        <TableCell>{log.descricao}</TableCell>
                    </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum log encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
