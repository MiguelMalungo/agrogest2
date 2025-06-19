import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    className: 'w-[350px] p-4',
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Cartão AgroGest</h3>
        <p className="text-sm text-gray-200">
          Este é um exemplo de cartão com o estilo AgroGest. Todos os cartões têm um fundo verde-escuro com blur e opacidade, permitindo ver subtilmente o fundo.
        </p>
      </div>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    className: 'w-[350px]',
    children: (
      <>
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold">Cabeçalho do Cartão</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-200">
            Este cartão inclui um cabeçalho separado por uma borda sutil.
          </p>
        </div>
      </>
    ),
  },
};