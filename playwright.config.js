import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация Playwright для E2E-тестов калькулятора
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Максимальное время выполнения одного теста */
  timeout: 30 * 1000,
  expect: {
    /* Максимальное время ожидания для expect */
    timeout: 5000
  },
  /* Запускать тесты в файлах параллельно */
  fullyParallel: true,
  /* Не запускать тесты в CI/CD, если не указано иное */
  forbidOnly: !!process.env.CI,
  /* Повторять тесты при сбое в CI/CD */
  retries: process.env.CI ? 2 : 0,
  /* Количество воркеров для параллельного запуска */
  workers: process.env.CI ? 1 : undefined,
  /* Репортер для использования */
  reporter: 'html',
  /* Общие настройки для всех проектов */
  use: {
    /* Базовый URL для использования в действиях типа navigate */
    baseURL: 'http://localhost:3000',
    /* Максимальное время для действий навигации */
    navigationTimeout: 30 * 1000,
    /* Максимальное время для каждого действия */
    actionTimeout: 10 * 1000,
    /* Собирать трейс при повторе теста после сбоя */
    trace: 'on-first-retry',
    /* Делать скриншоты только при сбое */
    screenshot: 'only-on-failure',
  },

  /* Настройка проектов для разных браузеров */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Запускать локальный сервер перед тестами */
  webServer: {
    command: 'npx http-server . -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

