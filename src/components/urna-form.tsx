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
import { Card, CardContent } from '@/components/ui/card';
import type { Urna } from '@/lib/types';

const formSchema = z.object({
  numero: z.string().min(1, 'O número é obrigatório.'),
  localizacao: z.string().min(3, 'A localização deve ter pelo menos 3 caracteres.'),
});

type UrnaFormValues = z.infer<typeof formSchema>;

type UrnaFormProps = {
  onSubmit: (data: UrnaFormValues) => void;
  defaultValues?: Partial<Urna>;
};

export default function UrnaForm({ onSubmit, defaultValues }: UrnaFormProps) {
  const router = useRouter();
  const form = useForm<UrnaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero: defaultValues?.numero || '',
      localizacao: defaultValues?.localizacao || '',
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Urna</FormLabel>
                  <FormControl>
                    <Input placeholder="001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="localizacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Escola Municipal, Sala 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
