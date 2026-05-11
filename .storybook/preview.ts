import type { Preview } from '@storybook/react';
import '../app/globals.css';

declare global {
  interface Window {
    process: {
      env: Record<string, string | undefined>;
    };
  }
}

if (typeof window !== 'undefined') {
  window.process = window.process || { env: {} };
}

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
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (iPhone 14)',
          styles: { width: '390px', height: '844px' },
        },
        tablet: {
          name: 'Tablet (iPad Air)',
          styles: { width: '820px', height: '1180px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
      defaultViewport: 'mobile',
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