
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Building, ShoppingBag, Sparkles } from 'lucide-react';
import { processedStatement } from '@/utils/processStatement';
import { cn } from '@/lib/utils';
import { fetchGeminiAnalysis } from '@/utils/geminiClient';

interface StatementViewerProps {
  statementData?: typeof processedStatement;
  isProcessing: boolean;
}

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'seguro':
      return <ShieldCheck className="h-5 w-5 text-blue-500" />;
    case 'tarifa':
      return <Building className="h-5 w-5 text-amber-500" />;
    case 'compra':
      return <ShoppingBag className="h-5 w-5 text-green-600" />;
    default:
      return <span className="text-sm font-medium text-gray-500">?</span>;
  }
};

const StatementViewer: React.FC<StatementViewerProps> = ({ statementData, isProcessing }) => {
  const [insight, setInsight] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGeminiClick = async () => {
    if (!statementData) return;
    const rawText = statementData.content.map(item => item.text).join('\n');
    setLoadingAI(true);
    const result = await fetchGeminiAnalysis(rawText);
    setInsight(result);
    setLoadingAI(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Resumo do Extrato</CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Analisando o extrato...</p>
              <Progress value={70} className="h-2 animate-pulse" />
            </div>
          )}

          {!isProcessing && statementData && statementData.content.length > 0 ? (
            <div className="space-y-4 mt-4">
              {statementData.content.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border-b pb-2 last:border-none"
                >
                  <div className="mt-1">{getIconForCategory(item.category)}</div>
                  <div>
                    <p className="text-sm text-gray-800">{item.text}</p>
                    <p className="text-xs text-gray-500 capitalize mt-1">Categoria: {item.category}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button variant="outline" onClick={handleGeminiClick} disabled={loadingAI}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {loadingAI ? 'Consultando IA...' : 'Obter análise com IA (Gemini)'}
                </Button>
              </div>
              {insight && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <p className="text-sm whitespace-pre-line">{insight}</p>
                </div>
              )}
            </div>
          ) : null}

          {!isProcessing && (!statementData || statementData.content.length === 0) && (
            <p className="text-sm text-gray-500">Nenhuma informação processada foi encontrada. Envie um extrato para começar.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatementViewer;
