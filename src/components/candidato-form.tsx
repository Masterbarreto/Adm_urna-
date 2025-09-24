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
  eleicaoId: z.string({ required_error: 'Selecione uma eleição.' }),
  fotoUrl: z.string().url('URL da foto inválida.').optional().or(z.literal('')),
});

type CandidatoFormValues = z.infer<typeof formSchema>;

type CandidatoFormProps = {
  onSubmit: (data: CandidatoFormValues) => void;
  defaultValues?: Partial<Candidato>;
};

export default function CandidatoForm({ onSubmit, defaultValues }: CandidatoFormProps) {
  const router = useRouter();
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  
  const form = useForm<CandidatoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: defaultValues?.nome || '',
      numero: defaultValues?.numero || undefined,
      eleicaoId: defaultValues?.eleicaoId ? String(defaultValues.eleicaoId) : '',
      fotoUrl: defaultValues?.fotoUrl || '',
    },
  });

  useEffect(() => {
      const fetchEleicoes = async () => {
          try {
              const response = await api.get('/eleicoes');
              setEleicoes(response.data);
          } catch (error) {
              console.error("Erro ao buscar eleições:", error);
          }
      };
      fetchEleicoes();
  }, []);

  const fotoUrl = form.watch('fotoUrl');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // O ideal seria fazer o upload para um serviço de storage e obter a URL.
      // Por enquanto, vamos usar a URL de dados (Base64), mas sua API espera uma foto_url.
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('fotoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center gap-4">
                    <Avatar className="h-40 w-40">
                        <AvatarImage src={fotoUrl} alt={form.getValues('nome')} data-ai-hint="person portrait" />
                        <AvatarFallback className="text-4xl">
                            {form.getValues('nome')?.substring(0, 2).toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>
                     <Button type="button" variant="outline" asChild>
                        <label htmlFor="foto-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Alterar Foto
                        </label>
                    </Button>
                    <input type="file" id="foto-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
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
                            name="eleicaoId"
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
                                                <SelectItem key={eleicao.id} value={String(eleicao.id)}>{eleicao.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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
