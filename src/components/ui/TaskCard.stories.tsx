import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './TaskCard';

// Simulação do store Zustand para o Storybook
import { useTaskStore } from '../../stores/useTaskStore';
// @ts-expect-error - Ignorando erro de tipagem para mock do Zustand
useTaskStore.getState = () => ({
  updateTaskStatus: (id, status) => {
    console.log(`Tarefa ${id} atualizada para ${status} (mock)`);
  },
});

const meta: Meta<typeof TaskCard> = {
  title: 'UI/TaskCard',
  component: TaskCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Cartão para exibição e interação com tarefas agrícolas.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const TarefaPendente: Story = {
  args: {
    task: {
      id: 'task-1',
      titulo: 'Rega - Campo A',
      descricao: 'Tarefa de rega no Campo A',
      tipo: 'rega',
      status: 'pendente',
      campo: 'A',
      dataExecucao: new Date(2025, 5, 20, 8, 0),
      horaExecucao: '08:00',
      criadoEm: new Date(2025, 5, 19, 14, 30),
      atualizadoEm: new Date(2025, 5, 19, 14, 30),
      userId: 'user1',
    },
  },
};

export const TarefaEmCurso: Story = {
  args: {
    task: {
      id: 'task-2',
      titulo: 'Pulverização - Campo B',
      descricao: 'Aplicação de fungicida no Campo B',
      tipo: 'pulverizacao',
      status: 'em_curso',
      campo: 'B',
      dataExecucao: new Date(2025, 5, 19, 10, 0),
      horaExecucao: '10:00',
      criadoEm: new Date(2025, 5, 18, 9, 15),
      atualizadoEm: new Date(2025, 5, 19, 10, 5),
      userId: 'user1',
    },
  },
};

export const TarefaConcluida: Story = {
  args: {
    task: {
      id: 'task-3',
      titulo: 'Plantio - Campo C',
      descricao: 'Plantio de milho no Campo C',
      tipo: 'plantio',
      status: 'concluida',
      campo: 'C',
      dataExecucao: new Date(2025, 5, 15, 7, 30),
      horaExecucao: '07:30',
      criadoEm: new Date(2025, 5, 14, 16, 45),
      atualizadoEm: new Date(2025, 5, 15, 12, 20),
      userId: 'user1',
    },
  },
};