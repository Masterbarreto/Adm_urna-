'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent } from '@/components/ui/card';
import type { Eleicao, Urna } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const formSchema = z
  .object({
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    dataInicio: z.date({
      required_error: 'A data de início é obrigatória.',
    }),
    dataFim: z.date({
      required_error: 'A data de fim é obrigatória.',
    }),
    urnaId: z.string({ required_error: 'Selecione uma urna.' }),
  })
  .refine((data) => data.dataFim > data.dataInicio, {
    message: 'A data de fim deve ser posterior à data de início.',
    path: ['dataFim'],
  });

type EleicaoFormValues = z.infer<typeof formSchema>;

type EleicaoFormProps = {
  onSubmit: (data: EleicaoFormValues) => void;
  defaultValues?: Partial<Eleicao>;
};

export default function EleicaoForm({
  onSubmit,
  defaultValues,
}: EleicaoFormProps) {
  const router = useRouter();
  const [urnas, setUrnas] = useState<Urna[]>([]);
  
  const form = useForm<EleicaoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: defaultValues?.nome || '',
      dataInicio: defaultValues?.data_inicio
        ? new Date(defaultValues.data_inicio)
        : undefined,
      dataFim: defaultValues?.data_fim
        ? new Date(defaultValues.data_fim)
        : undefined,
      urnaId: defaultValues?.id_urna ? String(defaultValues.id_urna) : '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urnasRes = await api.get('/v1/urnas');
        setUrnas(urnasRes.data.data.urnas || []);
      } catch (error) {
        console.error("Erro ao buscar dados para o formulário:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Eleição</FormLabel>
                  <FormControl>
                    <Input placeholder="Eleição Municipal 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy', {
                                locale: ptBR,
                              })
                            ) : (
                              <span>Selecione a data de início</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Fim</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy', {
                                locale: ptBR,
                              })
                            ) : (
                              <span>Selecione a data de fim</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < (form.getValues('dataInicio') || new Date())
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="urnaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urna Associada</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma urna para esta eleição" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {urnas.length > 0 ? urnas.map((urna: Urna) => (
                        <SelectItem key={urna.id} value={String(urna.id)}>
                          Nº {urna.numero} - {urna.localizacao}
                        </SelectItem>
                      )) : <p className="p-4 text-sm text-muted-foreground">Nenhuma urna disponível</p>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
