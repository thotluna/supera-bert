import type { Preview } from '@storybook/react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#f1f5f9' },
        { name: 'dark', value: '#020617' }
      ]
    },
    a11y: {
      config: {},
      options: {},
    },
  },

  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';

      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Sync visual background to avoid flicker
        const bgColor = theme === 'dark' ? '#020617' : '#f1f5f9';
        root.style.backgroundColor = bgColor;
      }

      return Story();
    },
  ],
};

export default preview;