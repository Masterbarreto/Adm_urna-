'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import { Card, CardContent } from '@/components/ui/card';
import type { Candidato, Eleicao } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const formSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  numero: z.coerce.number().min(1, 'O número deve ser maior que zero.'),
  partido: z.string().optional(),
  id_eleicao: z.string({ required_error: 'Selecione uma eleição.' }),
  foto: z.any().optional(),
});

export type CandidatoFormValues = z.infer<typeof formSchema>;

type CandidatoFormProps = {
  onSubmit: (data: CandidatoFormValues) => void;
  defaultValues?: Partial<Candidato>;
  isEditing?: boolean;
};

export default function CandidatoForm({ onSubmit, defaultValues, isEditing = false }: CandidatoFormProps) {
  const router = useRouter();
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  const [fotoPreview, setFotoPreview] = useState<string | null>(defaultValues?.foto_url || null);
  
  const form = useForm<CandidatoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: defaultValues?.nome || '',
      numero: defaultValues?.numero || undefined,
      partido: defaultValues?.partido || '',
      id_eleicao: defaultValues?.id_eleicao ? String(defaultValues.id_eleicao) : undefined,
    },
  });

  useEffect(() => {
      const fetchEleicoes = async () => {
          try {
              const response = await api.get('/v1/eleicoes');
              const electionsData = response.data?.data?.eleicoes || [];
              setEleicoes(Array.isArray(electionsData) ? electionsData : []);
          } catch (error) {
              console.error("Erro ao buscar eleições:", error);
              setEleicoes([]);
          }
      };
      fetchEleicoes();
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('foto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFormSubmit = (values: CandidatoFormValues) => {
    onSubmit(values);
  };


  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center gap-4">
                    <Avatar className="h-40 w-40">
                        <AvatarImage src={fotoPreview || undefined} alt={form.getValues('nome')} data-ai-hint="person portrait" />
                        <AvatarFallback className="text-4xl">
                            {form.getValues('nome')?.substring(0, 2).toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>
                     <Button type="button" variant="outline" asChild>
                        <label htmlFor="foto-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            {isEditing ? 'Alterar Foto' : 'Enviar Foto'}
                        </label>
                    </Button>
                    <input type="file" id="foto-upload" className="hidden" accept="image/*" onChange={handleFotoChange} />
                    <FormMessage>{form.formState.errors.foto?.message?.toString()}</FormMessage>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                            <Input placeholder="Nome do Candidato" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="numero"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="partido"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Partido (Opcional)</FormLabel>
                                <FormControl>
                                <Input placeholder="Nome do Partido" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="id_eleicao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eleição</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a qual eleição o candidato pertence" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {eleicoes.map((eleicao: Eleicao) => (
                                            <SelectItem key={eleicao.id} value={String(eleicao.id)}>{eleicao.titulo}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-8">
              <Button type="button" variant="outline" onClick={() => router.back()}>
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
