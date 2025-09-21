'use client';

import { useState } from 'react';
import { UploadCloud, File, CheckCircle } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function ImportarEleitoresPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<string[][]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        setFile(selectedFile);
        handleFileUpload(selectedFile);
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }


  const handleFileUpload = (file: File) => {
    setUploading(true);
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

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleProcessImport = () => {
    alert('Importação processada! (Simulação)');
    // Reset state
    setFile(null);
    setPreviewData([]);
    setUploadProgress(0);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Importar Eleitores"
        description="Carregue um arquivo CSV com os dados dos eleitores."
        backHref="/eleitores"
      />

      <div className="grid gap-8">
        <Card
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
          <CardContent className="p-6">
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Upload de Arquivo</h3>
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
                        <p className="text-sm font-medium">Enviando...</p>
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
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Pré-visualização</h3>
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
