import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from './KPICard';
import { BarChart2, Droplets, Tractor, Banana } from 'lucide-react';

const meta: Meta<typeof KPICard> = {
  title: 'UI/KPICard',
  component: KPICard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const AreaTratada: Story = {
  args: {
    title: 'Área Tratada',
    value: '25 ha',
    trend: {
      value: 12,
      isPositive: true
    },
    icon: <BarChart2 className="h-5 w-5" />,
  },
};

export const LitrosAgua: Story = {
  args: {
    title: 'Litros de Água',
    value: '1.250 L',
    trend: {
      value: 5,
      isPositive: false
    },
    icon: <Droplets className="h-5 w-5" />,
  },
};

export const KgFertilizante: Story = {
  args: {
    title: 'Kg Fertilizante',
    value: '450 kg',
    trend: {
      value: 0,
      isPositive: true
    },
    icon: <Tractor className="h-5 w-5" />,
  },
};

export const Producao: Story = {
  args: {
    title: 'Produção',
    value: '2.300 kg',
    trend: {
      value: 18,
      isPositive: true
    },
    icon: <Banana className="h-5 w-5" />,
  },
};