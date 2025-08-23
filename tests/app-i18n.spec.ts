import { test, expect } from '@playwright/test';

test.describe('i18n routing', () => {
  test('navigation links show locale prefixes and labels', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('link', { name: 'Books' })).toHaveAttribute('href', '/en/books');

    await page.goto('/es');
    await expect(page.getByRole('link', { name: 'Libros' })).toHaveAttribute('href', '/es/books');
  });

  test('switching locales updates URL and text', async ({ page }) => {
    await page.goto('/en');
    await page.selectOption('select', 'es');
    await page.waitForURL('**/es');
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
  });

  test('subpage shows translated content', async ({ page }) => {
    await page.goto('/es/books');
    await expect(page.getByRole('heading', { name: 'Biblioteca de Textos Zen' })).toBeVisible();
  });

  test('reload retains locale', async ({ page }) => {
    await page.goto('/en');
    await page.selectOption('select', 'es');
    await page.waitForURL('**/es');
    await page.reload();
    await expect(page).toHaveURL(/\/es/);
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
  });
});
