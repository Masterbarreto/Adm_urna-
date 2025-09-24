'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Card, CardContent } from '@/components/ui/card';
import type { Eleitor } from '@/lib/types';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  cpf: z.string().length(11, 'O CPF deve conter exatamente 11 dígitos.'),
  matricula: z.string().min(1, 'A matrícula é obrigatória.'),
});

type EleitorFormValues = z.infer<typeof formSchema>;

type EleitorFormProps = {
  onSubmit: (data: EleitorFormValues) => void;
  defaultValues?: Partial<Eleitor>;
};

export default function EleitorForm({ onSubmit, defaultValues }: EleitorFormProps) {
  const router = useRouter();
  const form = useForm<EleitorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: defaultValues?.nome || '',
      cpf: defaultValues?.cpf?.replace(/\D/g, '') || '', // Remove formatting for editing
      matricula: defaultValues?.matricula || '',
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do Eleitor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CPF (somente números)</FormLabel>
                        <FormControl>
                        <Input placeholder="11122233344" {...field} maxLength={11} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="matricula"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Matrícula</FormLabel>
                        <FormControl>
                        <Input placeholder="000000000" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
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
