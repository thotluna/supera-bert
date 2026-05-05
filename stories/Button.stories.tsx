import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../app/components/ui/button';
import { Mail, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Nuevo Simulacro',
    size: 'lg',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Continuar con Google',
    size: 'lg',
  },
};


export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Siguiente pregunta',
    rightIcon: <ArrowRight className="w-4 h-4" />,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Eliminar respuesta',
    leftIcon: <Trash2 className="w-4 h-4" />,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: '¡Correcto!',
    leftIcon: <CheckCircle2 className="w-4 h-4" />,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Cargando...',
  },
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    leftIcon: <Mail className="w-4 h-4" />,
    children: 'Enviar por email',
  },
};
