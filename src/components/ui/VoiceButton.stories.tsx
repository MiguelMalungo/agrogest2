import type { Meta, StoryObj } from '@storybook/react';
import { VoiceButton } from './VoiceButton';
import { useTaskStore } from '../../stores/useTaskStore';

// Mock do store Zustand para o Storybook
// @ts-expect-error - Ignorando erro de tipagem para mock do Zustand
useTaskStore.getState = () => ({
  tasks: [],
  addTask: (task) => {
    console.log('Tarefa adicionada (mock):', task);
  },
});

const meta: Meta<typeof VoiceButton> = {
  title: 'UI/VoiceButton',
  component: VoiceButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botão flutuante para registro de comandos por voz. Usa a API de reconhecimento de voz do navegador e simula integração com Google Cloud Speech-to-Text.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VoiceButton>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'O VoiceButton é um botão flutuante verde com ícone de microfone. Ao clicar, ativa o reconhecimento de voz (se suportado pelo navegador).',
      },
    },
  },
};