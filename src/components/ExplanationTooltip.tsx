
import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ExplanationTooltipProps {
  explanation: string;
}

const ExplanationTooltip = ({ explanation }: ExplanationTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={isVisible} onOpenChange={setIsVisible}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={() => setIsVisible(!isVisible)}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary" />
            <span className="sr-only">Mostrar explicação</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-[300px] p-3 text-sm bg-white"
        >
          {explanation}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExplanationTooltip;
