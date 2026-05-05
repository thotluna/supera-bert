import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OptionsMode } from '../app/components/config/mode-quiz/options-mode';
import { Trophy, Timer, Brain } from 'lucide-react';

const meta: Meta<typeof OptionsMode> = {
  title: 'Config/OptionsMode',
  component: OptionsMode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['standard', 'timed', 'untimed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OptionsMode>;

export const Standard: Story = {
  args: {
    mode: 'standard',
    name: 'Modo Estándar',
    description: 'Simulacro tradicional con tiempo y preguntas fijas.',
    icon: <Trophy className="w-5 h-5" />,
  },
};

export const Timed: Story = {
  args: {
    mode: 'timed',
    name: 'Modo Contra Reloj',
    description: 'Desafío intenso con tiempo limitado por pregunta.',
    icon: <Timer className="w-5 h-5" />,
  },
};

export const Untimed: Story = {
  args: {
    mode: 'untimed',
    name: 'Modo Libre',
    description: 'Practica sin presión de tiempo a tu propio ritmo.',
    icon: <Brain className="w-5 h-5" />,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl p-6">
      <OptionsMode 
        mode="standard"
        name="Modo Estándar"
        description="Simulacro tradicional con tiempo y preguntas fijas."
        icon={<Trophy className="w-5 h-5" />}
      />
      <OptionsMode 
        mode="timed"
        name="Modo Contra Reloj"
        description="Desafío intenso con tiempo limitado por pregunta."
        icon={<Timer className="w-5 h-5" />}
      />
      <OptionsMode 
        mode="untimed"
        name="Modo Libre"
        description="Practica sin presión de tiempo a tu propio ritmo."
        icon={<Brain className="w-5 h-5" />}
      />
    </div>
  ),
};

