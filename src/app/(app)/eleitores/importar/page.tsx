'use client';

import { useState } from 'react';
import { UploadCloud, File, CheckCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

type ImportResult = {
  message: string;
  importedCount: number;
  failedCount: number;
  errors: string[];
}

export default function ImportarEleitoresPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImportResult(null);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        setFile(selectedFile);
        setImportResult(null);
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleProcessImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/eleitores/importar', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      setImportResult(response.data);
      toast({
        title: 'Importação Concluída',
        description: `${response.data.importedCount} eleitores importados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro na importação:", error);
      toast({
        title: 'Erro na Importação',
        description: 'Ocorreu um erro ao processar o arquivo. Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
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
        
        <Card onDrop={handleDrop} onDragOver={handleDragOver}>
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
                {isUploading && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Enviando arquivo...</p>
                        <Progress value={uploadProgress} />
                    </div>
                )}
                {file && !isUploading && (
                    <div className="flex items-center p-3 text-sm rounded-md bg-muted text-muted-foreground">
                        <File className="w-5 h-5 mr-3" />
                        <span>{file.name} ({Math.round(file.size / 1024)} KB) - Pronto para importação</span>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
        
        {importResult && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Importação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-success">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-bold">{importResult.importedCount}</span>
                    <span className="ml-1">importados</span>
                  </div>
                  <div className={`flex items-center ${importResult.failedCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-bold">{importResult.failedCount}</span>
                    <span className="ml-1">falhas</span>
                  </div>
                </div>
                {importResult.errors && importResult.errors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Detalhes dos Erros:</h4>
                    <div className="max-h-40 overflow-y-auto bg-muted p-3 rounded-md">
                      <ul className="text-sm text-destructive space-y-1">
                        {importResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
            <Button onClick={handleProcessImport} disabled={!file || isUploading}>
                {isUploading ? 'Processando...' : 'Processar Importação'}
            </Button>
        </div>
      </div>
    </div>
  );
}
