import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('tests de contraste', () => {

  test.describe('root', () => {
    const modes = ['light', 'dark'] as const;




    for (const mode of modes) {
      test(`prueba de contraste - modo ${mode}`, async ({ page }) => {
        await page.goto('/');
        await page.emulateMedia({ colorScheme: mode });

        await page.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }

    test.describe('quiz', () => {
      const modes = ['light', 'dark'] as const;




      for (const mode of modes) {
        test(`prueba de contraste - modo ${mode}`, async ({ page }) => {
          await page.goto('/quiz?mode=timed&topics=all');
          await page.emulateMedia({ colorScheme: mode });

          await page.waitForLoadState('networkidle');

          const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

          expect(accessibilityScanResults.violations).toEqual([]);
        });
      }
    })

    test.describe('results', () => {
      const modes = ['light', 'dark'] as const;

      for (const mode of modes) {
        test(`prueba de contraste - modo ${mode}`, async ({ page }) => {
          await page.goto('/quiz/results/11a4805a-fb56-431d-8dcb-569abdfe56d6');
          await page.emulateMedia({ colorScheme: mode });
          await page.waitForLoadState('networkidle');

          // Testeamos los 3 primeros casos (Acierto, Fallo, No contestada)
          const questions = page.locator('section:has-text("Revisión Detallada") button');
          const count = Math.min(await questions.count(), 3);

          for (let i = 0; i < count; i++) {
            await questions.nth(i).click();
            await page.waitForTimeout(600);
            
            const accessibilityScanResults = await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
              .analyze();

            expect(accessibilityScanResults.violations).toEqual([]);
          }
        });
      }
    })
  })
})