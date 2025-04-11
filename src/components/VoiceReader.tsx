
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ProcessedStatement } from '@/utils/processStatement';

interface VoiceReaderProps {
  statementData: ProcessedStatement;
}

const VoiceReader = ({ statementData }: VoiceReaderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    speechSynthRef.current = new SpeechSynthesisUtterance();
    
    // Set Portuguese as the language
    speechSynthRef.current.lang = 'pt-BR';
    
    // Event handler for when speech ends
    const handleSpeechEnd = () => {
      // Move to next item if we're not at the end
      if (currentItemIndex < statementData.items.length - 1 && isPlaying) {
        setCurrentItemIndex(prev => prev + 1);
      } else {
        // End of items reached
        setIsPlaying(false);
        setCurrentItemIndex(-1);
      }
    };
    
    speechSynthRef.current.onend = handleSpeechEnd;
    
    return () => {
      // Clean up
      if (speechSynthRef.current) {
        speechSynthRef.current.onend = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, [statementData, isPlaying]);
  
  // Update volume when slider changes
  useEffect(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.volume = volume[0] / 100;
    }
  }, [volume]);
  
  // Handle playing current item
  useEffect(() => {
    if (isPlaying && currentItemIndex >= 0 && currentItemIndex < statementData.items.length) {
      const currentItem = statementData.items[currentItemIndex];
      const textToRead = `${currentItem.date}. ${currentItem.description}. Valor: R$ ${currentItem.amount.toFixed(2)}. Explicação: ${currentItem.explanation}`;
      
      if (speechSynthRef.current) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Set the text and speak
        speechSynthRef.current.text = textToRead;
        speechSynthRef.current.volume = volume[0] / 100;
        window.speechSynthesis.speak(speechSynthRef.current);
      }
    }
  }, [currentItemIndex, isPlaying, statementData.items, volume]);
  
  // Toggle play/pause
  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis.cancel();
    } else {
      setIsPlaying(true);
      
      // If no item is selected or we reached the end, start from beginning
      if (currentItemIndex < 0 || currentItemIndex >= statementData.items.length - 1) {
        setCurrentItemIndex(0);
      } else {
        // Continue from current position
        window.speechSynthesis.resume();
      }
    }
  };
  
  // Navigate to previous item
  const handlePrevious = () => {
    window.speechSynthesis.cancel();
    
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    } else {
      setCurrentItemIndex(0);
    }
    
    // If not playing, start playing
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };
  
  // Navigate to next item
  const handleNext = () => {
    window.speechSynthesis.cancel();
    
    if (currentItemIndex < statementData.items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentItemIndex(-1);
    }
    
    // If not playing, start playing
    if (!isPlaying && currentItemIndex < statementData.items.length - 1) {
      setIsPlaying(true);
    }
  };
  
  return (
    <div className="bg-white border rounded-lg p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="h-8 w-8 p-0"
              disabled={!statementData.items.length || (isPlaying && currentItemIndex <= 0)}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              onClick={togglePlayback}
              className="h-8 w-8 p-0"
              disabled={!statementData.items.length}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="h-8 w-8 p-0"
              disabled={!statementData.items.length || (isPlaying && currentItemIndex >= statementData.items.length - 1)}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <span className="font-medium text-sm ml-2">
            {isPlaying ? "Pausar leitura" : "Ler extrato"}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 w-1/3">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={10}
            className="w-full"
          />
        </div>
      </div>
      
      {statementData.items.length > 0 && (isPlaying || currentItemIndex >= 0) && (
        <div className="px-3 py-2 bg-primary/10 rounded text-sm border-l-4 border-primary">
          {currentItemIndex >= 0 && currentItemIndex < statementData.items.length ? (
            <div className="flex flex-col">
              <div className="font-medium">
                {statementData.items[currentItemIndex].description}
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                {statementData.items[currentItemIndex].explanation}
              </div>
            </div>
          ) : (
            <span>Selecione um item para leitura</span>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceReader;
