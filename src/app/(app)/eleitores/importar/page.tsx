'use client';

import { useState } from 'react';
import { UploadCloud, File, CheckCircle } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function ImportarEleitoresPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      readAndPreviewFile(selectedFile);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        setFile(selectedFile);
        readAndPreviewFile(selectedFile);
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }


  const readAndPreviewFile = (file: File) => {
    setUploading(false); // Apenas preview, não upload real ainda
    setUploadProgress(0);

    // Simulate file reading and parsing for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(0, 6); // Header + 5 lines
      const data = lines.map(line => line.split(','));
      setPreviewData(data);
    };
    reader.readAsText(file);
    setUploadProgress(100); // Marca como pronto para importação
  };

  const handleProcessImport = async () => {
    if (!file) return;

    // A API não possui um endpoint para importação de arquivos.
    // O ideal seria um `POST /eleitores/importar` que aceita multipart/form-data
    toast({
        title: 'Funcionalidade Indisponível',
        description: 'A API não possui um endpoint para importar eleitores. Ação simulada.',
        variant: 'destructive'
    });
    console.log('Simulando importação do arquivo:', file.name);
    setUploading(true);

    // Simulação de progresso de importação
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          setUploading(false);
           toast({
            title: 'Importação (Simulada) Concluída',
            description: "Os eleitores foram processados com sucesso.",
          });
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Importar Eleitores"
        description="Carregue um arquivo CSV com os dados dos eleitores."
        backHref="/eleitores"
      />

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Instruções para o Arquivo</CardTitle>
            <CardDescription>
              Para garantir uma importação bem-sucedida, seu arquivo CSV ou Excel deve seguir o formato especificado abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">O arquivo deve conter as seguintes colunas, na ordem exata e com a primeira linha servindo como cabeçalho:</p>
            <ol className="mb-4 list-decimal pl-5 text-sm space-y-2">
              <li><code className="font-mono bg-muted px-1.5 py-0.5 rounded-sm">nome</code>: O nome completo do eleitor.</li>
              <li><code className="font-mono bg-muted px-1.5 py-0.5 rounded-sm">cpf</code>: O CPF do eleitor no formato <code className="font-mono bg-muted px-1.5 py-0.5 rounded-sm">000.000.000-00</code>.</li>
              <li><code className="font-mono bg-muted px-1.5 py-0.5 rounded-sm">matricula</code>: A matrícula ou número de identificação único do eleitor.</li>
            </ol>
            <p className="text-sm text-muted-foreground">Exemplo de linha em um arquivo CSV:</p>
            <pre className="mt-2 p-2 bg-muted rounded-md text-sm"><code>"João da Silva","111.222.333-44","12345678"</code></pre>
          </CardContent>
        </Card>
        
        <Card
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
          <CardHeader>
            <CardTitle>Upload de Arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-border bg-card hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV ou Excel (máx. 5MB)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </label>
              </div>
                {uploading && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Processando importação...</p>
                        <Progress value={uploadProgress} />
                    </div>
                )}
                {file && !uploading && (
                    <div className="flex items-center p-3 text-sm rounded-md bg-muted text-muted-foreground">
                        {uploadProgress === 100 ? <CheckCircle className="w-5 h-5 mr-3 text-success" /> : <File className="w-5 h-5 mr-3" />}
                        <span>{file.name} ({Math.round(file.size / 1024)} KB) - {uploadProgress === 100 ? 'Pronto para importação' : 'Upload Concluído'}</span>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
        
        {previewData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {previewData[0].map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(1).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
            <Button onClick={handleProcessImport} disabled={!file || uploading || previewData.length === 0}>
                Processar Importação
            </Button>
        </div>
      </div>
    </div>
  );
}
