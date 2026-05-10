import type { Meta, StoryObj } from '@storybook/react';
import { ReportButton } from '../app/quiz/components/report-button';

const meta: Meta<typeof ReportButton> = {
  title: 'Quiz/ReportButton',
  component: ReportButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    questionId: 'q-test-123',
    itcCode: 'ITC-BT-03',
  }
};

export default meta;
type Story = StoryObj<typeof ReportButton>;

export const Default: Story = {
  args: {
    showText: true,
  },
};

export const ModalOpen: Story = {
  args: {
    defaultOpen: true,
  },
};

export const IconOnly: Story = {
  args: {
    showText: false,
  },
};
