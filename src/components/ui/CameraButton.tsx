import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Camera, Loader2, X } from 'lucide-react';
import { Card } from './Card';

// Interface para as props do componente CameraButton
interface CameraButtonProps {
  className?: string;
}

// Tipos de doenças/pragas que podem ser detectadas
type DetectionType = 'ferrugem' | 'míldio' | 'lagarta' | 'pulgões' | 'saudável';

// Interface para o resultado da detecção
interface DetectionResult {
  type: DetectionType;
  confidence: number;
  description: string;
  recommendations: string[];
}

/**
 * Componente CameraButton - Botão flutuante para captura e análise de imagens
 * Simula integração com Google Vision para detecção de pragas e doenças
 */
export const CameraButton: React.FC<CameraButtonProps> = ({ className }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Banco de dados simulado de doenças e pragas
  const diseasesDatabase: Record<DetectionType, DetectionResult> = {
    ferrugem: {
      type: 'ferrugem',
      confidence: 0.92,
      description: 'Ferrugem do milho (Puccinia sorghi). Manchas alaranjadas nas folhas.',
      recommendations: [
        'Aplicar fungicida à base de triazol ou estrobilurina',
        'Remover e destruir plantas infectadas',
        'Rotação de culturas para quebrar o ciclo da doença',
      ],
    },
    míldio: {
      type: 'míldio',
      confidence: 0.87,
      description: `Míldio do milho (Peronosclerospora sorghi). Manchas cloróticas e crescimento branco na parte inferior das folhas. <img src="${import.meta.env.BASE_URL}logo.png" />`,
      recommendations: [
        'Aplicar fungicida específico para oomicetos',
        'Melhorar a drenagem do solo',
        'Utilizar variedades resistentes na próxima plantação',
      ],
    },
    lagarta: {
      type: 'lagarta',
      confidence: 0.95,
      description: 'Lagarta-do-cartucho (Spodoptera frugiperda). Danos nas folhas e no cartucho do milho.',
      recommendations: [
        'Aplicar inseticida biológico à base de Bacillus thuringiensis',
        'Liberação de insetos predadores naturais',
        'Monitoramento constante da plantação',
      ],
    },
    pulgões: {
      type: 'pulgões',
      confidence: 0.89,
      description: 'Pulgões (Rhopalosiphum maidis). Insetos pequenos que sugam a seiva e podem transmitir viroses.',
      recommendations: [
        'Aplicar inseticida seletivo',
        'Favorecer a presença de inimigos naturais',
        'Evitar excesso de adubação nitrogenada',
      ],
    },
    saudável: {
      type: 'saudável',
      confidence: 0.98,
      description: 'Planta saudável. Não foram detectados sinais de doenças ou pragas.',
      recommendations: [
        'Continuar com as práticas atuais de manejo',
        'Manter o monitoramento regular',
        'Seguir o cronograma de adubação e irrigação',
      ],
    },
  };

  // Função para iniciar a captura de imagem
  const startCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para processar a imagem capturada
  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Criar URL da imagem para preview
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    setIsCapturing(true);

    // Simular envio para API de análise
    setIsAnalyzing(true);
    
    // Simulação de processamento de imagem e análise (em produção, enviar para Google Vision)
    setTimeout(() => {
      // Determinar aleatoriamente um resultado (para simulação)
      const possibleResults: DetectionType[] = ['ferrugem', 'míldio', 'lagarta', 'pulgões', 'saudável'];
      const randomIndex = Math.floor(Math.random() * possibleResults.length);
      const detectedIssue = possibleResults[randomIndex];
      
      setAnalysisResult(diseasesDatabase[detectedIssue]);
      setIsAnalyzing(false);
    }, 3000);
  };

  // Função para fechar o resultado e resetar o estado
  const closeResult = () => {
    setIsCapturing(false);
    setCapturedImage(null);
    setAnalysisResult(null);
    
    // Limpar o input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Botão de câmera */}
      <Button
        onClick={isCapturing ? undefined : startCapture}
        className={`fixed bottom-20 left-4 z-50 rounded-full w-14 h-14 shadow-md flex items-center justify-center ${
          isCapturing ? 'bg-gray-500' : 'bg-[#F5A926] hover:bg-orange-500'
        } ${className}`}
        aria-label="Capturar imagem"
        disabled={isCapturing}
      >
        <Camera className="h-6 w-6 text-white" />
      </Button>

      {/* Input de arquivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />

      {/* Modal de análise de imagem */}
      {isCapturing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <Card className="w-full max-w-md relative overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeResult}
              className="absolute right-2 top-2 z-10"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Análise de Imagem</h3>
              
              {capturedImage && (
                <div className="relative mb-4 rounded-lg overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Imagem capturada"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mb-2" />
                  <p className="text-sm text-gray-600">A analisar a imagem...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{analysisResult.type.charAt(0).toUpperCase() + analysisResult.type.slice(1)}</h4>
                    <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                      {Math.round(analysisResult.confidence * 100)}% de certeza
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600">{analysisResult.description}</p>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Recomendações:</h5>
                    <ul className="text-sm space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-600 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};