import React, { useState } from 'react';
import { Button } from './Button';
import { useTaskStore } from '../../stores/useTaskStore';
import { Mic, Loader2 } from 'lucide-react';

// Interface para as props do componente VoiceButton
interface VoiceButtonProps {
  className?: string;
}

/**
 * Componente VoiceButton - Botão flutuante para registro de comandos por voz
 * Usa a API de reconhecimento de voz do navegador e simula integração com Google Cloud Speech-to-Text
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({ className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { addTask } = useTaskStore();

  // Função para processar o comando de voz
  const processCommand = (text: string) => {
    // Processa comandos para adicionar tarefas
    // Exemplo: "Adicionar tarefa de rega no Campo A amanhã às 8h"
    const taskRegex = /adicionar tarefa de (\w+) no campo (\w+) (?:para )?(amanhã|hoje|segunda|terça|quarta|quinta|sexta|sábado|domingo)?(?: às (\d+)[h:]\s*(\d+)?)?/i;
    const match = text.match(taskRegex);

    if (match) {
      const taskType = match[1]; // tipo de tarefa (rega, plantio, etc)
      const fieldId = match[2]; // campo (A, B, etc)
      const dayText = match[3] || 'hoje'; // dia (hoje, amanhã, etc)
      const hour = match[4] ? parseInt(match[4]) : 8; // hora
      const minute = match[5] ? parseInt(match[5]) : 0; // minuto

      // Calcular a data com base no texto
      const date = new Date();
      if (dayText.toLowerCase() === 'amanhã') {
        date.setDate(date.getDate() + 1);
      } else if (dayText.toLowerCase() !== 'hoje') {
        // Determinar o dia da semana
        const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        const targetDay = days.findIndex(day => day === dayText.toLowerCase());
        if (targetDay !== -1) {
          const currentDay = date.getDay();
          const daysToAdd = (targetDay - currentDay + 7) % 7;
          date.setDate(date.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));
        }
      }

      // Definir hora e minuto
      date.setHours(hour, minute, 0);

      // Adicionar a tarefa
      addTask({
        titulo: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} - Campo ${fieldId.toUpperCase()}`,
        descricao: `Tarefa de ${taskType} no Campo ${fieldId.toUpperCase()}`,
        tipo: taskType as any, // Tratamos como TaskType
        status: 'pendente',
        campo: fieldId.toUpperCase(),
        dataExecucao: date,
        horaExecucao: `${hour}:${minute < 10 ? '0' + minute : minute}`,
        userId: 'user1',
      });

      // Feedback visual
      return {
        success: true,
        message: `Tarefa de ${taskType} adicionada para o Campo ${fieldId.toUpperCase()} em ${date.toLocaleDateString('pt-PT')} às ${hour}:${minute < 10 ? '0' + minute : minute}`
      };
    }

    return {
      success: false,
      message: 'Comando não reconhecido. Tente dizer "Adicionar tarefa de rega no Campo A amanhã às 8h"'
    };
  };

  // Função para iniciar a escuta
  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsListening(true);
      setTranscript('');

      // Criar instância de reconhecimento de voz
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-PT';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const result = event.results[last][0].transcript;
        setTranscript(result);
        setIsListening(false);
        setIsProcessing(true);

        // Processar o comando após um curto delay para simular processamento
        setTimeout(() => {
          const processResult = processCommand(result);
          
          // Mostrar toast com o resultado (implementar toast)
          if (processResult.success) {
            alert(processResult.message);
          } else {
            alert(processResult.message);
          }
          
          setIsProcessing(false);
        }, 1500);
      };

      recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
        alert('Erro ao processar o áudio. Por favor, tente novamente.');
      };

      recognition.start();
    } else {
      alert('O reconhecimento de voz não é suportado neste navegador.');
    }
  };

  return (
    <Button
      onClick={isListening || isProcessing ? undefined : startListening}
      className={`fixed bottom-20 right-4 z-50 rounded-full w-14 h-14 shadow-md flex items-center justify-center ${
        isListening ? 'bg-red-500 hover:bg-red-600' : 
        isProcessing ? 'bg-orange-500 hover:bg-orange-600' : 
        'bg-[#F5A926] hover:bg-orange-500'
      } ${className}`}
      aria-label="Adicionar por voz"
    >
      {isListening ? (
        <div className="animate-pulse">
          <Mic className="h-6 w-6 text-white" />
        </div>
      ) : isProcessing ? (
        <Loader2 className="h-6 w-6 text-white animate-spin" />
      ) : (
        <Mic className="h-6 w-6 text-white" />
      )}
    </Button>
  );
};

// Declare global SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}