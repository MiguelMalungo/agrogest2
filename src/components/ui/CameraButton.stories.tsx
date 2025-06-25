import type { Meta, StoryObj } from '@storybook/react';
import { CameraButton } from './CameraButton';

const meta: Meta<typeof CameraButton> = {
  title: 'UI/CameraButton',
  component: CameraButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botão flutuante para captura e análise de imagens. Simula integração com Google Vision para detecção de pragas e doenças.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CameraButton>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'O CameraButton é um botão flutuante verde com ícone de câmera. Ao clicar, abre a interface de captura de imagem do dispositivo.',
      },
    },
  },
};