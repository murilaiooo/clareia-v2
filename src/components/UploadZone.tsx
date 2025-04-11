
import React, { useRef, useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback((file: File) => {
    if (!file.type.includes('text') && !file.type.includes('pdf')) {
      toast({ title: 'Arquivo inválido', description: 'Por favor, envie um arquivo de texto ou PDF.', variant: 'destructive' });
      return;
    }

    setSelectedFile(file);
    setLoading(true);
    onFileUpload(file);
    setTimeout(() => setLoading(false), 500); // Simula carregamento
  }, [onFileUpload, toast]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="w-full max-w-xl mx-auto p-6 mt-6 border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors duration-300" 
      onDrop={handleDrop} 
      onDragOver={(e) => e.preventDefault()}
      role="button"
      tabIndex={0}
      aria-label="Área para envio de arquivo"
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
    >
      <CardContent className="text-center space-y-4">
        {loading ? (
          <div className="animate-pulse text-gray-500">Carregando arquivo...</div>
        ) : selectedFile ? (
          <div className="flex items-center justify-center gap-2">
            <File className="w-5 h-5 text-green-500" />
            <span>{selectedFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              aria-label="Remover arquivo"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto w-8 h-8 text-blue-500" />
            <p className="text-sm text-gray-500">Arraste um arquivo ou clique para selecionar</p>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        {selectedFile && (
          <Button variant="secondary" onClick={() => onFileUpload(selectedFile)}>
            Reenviar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadZone;
