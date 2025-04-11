
import React, { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProcessedStatement } from '@/utils/processStatement';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportButtonProps {
  statementData?: ProcessedStatement;
}

const ExportButton: React.FC<ExportButtonProps> = ({ statementData }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(() => {
    if (!statementData || !statementData.content || statementData.content.length === 0) {
      toast({
        title: 'Nada para exportar',
        description: 'Você precisa carregar um arquivo válido antes de exportar.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsExporting(true);
      const doc = new jsPDF();
      doc.text('Resumo extraído:', 10, 10);
      const rows = statementData.content.map((item, idx) => [idx + 1, item]);
      (doc as any).autoTable({
        head: [['#', 'Trecho']],
        body: rows,
        startY: 20
      });
      doc.save('resumo.pdf');
      toast({
        title: 'Exportação concluída',
        description: 'O arquivo foi salvo com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Algo deu errado ao tentar exportar.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  }, [statementData, toast]);

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || !statementData}
      variant="default"
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {isExporting ? 'Exportando...' : 'Exportar como PDF'}
    </Button>
  );
};

export default ExportButton;
