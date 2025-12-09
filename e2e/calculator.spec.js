import { test, expect } from '@playwright/test';

test.describe('Калькулятор - E2E тесты', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на страницу калькулятора
    await page.goto('/calculator.html');
    
    // Ждем загрузки дисплея
    await expect(page.locator('#display')).toBeVisible();
  });

  test.describe('Начальное состояние', () => {
    test('должен отображать "0" при загрузке страницы', async ({ page }) => {
      const display = page.locator('#display');
      await expect(display).toHaveText('0');
    });
  });

  test.describe('Ввод чисел', () => {
    test('должен отображать введенное число', async ({ page }) => {
      await page.click('button:has-text("5")');
      await expect(page.locator('#display')).toHaveText('5');
    });

    test('должен добавлять цифры к существующему числу', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');
      await expect(page.locator('#display')).toHaveText('123');
    });

    test('должен заменять "0" на введенное число', async ({ page }) => {
      await page.click('button:has-text("7")');
      await expect(page.locator('#display')).toHaveText('7');
      await expect(page.locator('#display')).not.toHaveText('07');
    });

    test('должен обрабатывать ввод нуля', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button:has-text("0")');
      await expect(page.locator('#display')).toHaveText('50');
    });

    test('должен обрабатывать ввод всех цифр', async ({ page }) => {
      const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      for (const num of numbers) {
        await page.click(`button:has-text("${num}")`);
      }
      await expect(page.locator('#display')).toHaveText('1234567890');
    });
  });

  test.describe('Десятичная точка', () => {
    test('должен добавлять десятичную точку', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button:has-text(".")');
      await expect(page.locator('#display')).toHaveText('5.');
    });

    test('не должен добавлять вторую точку', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text(".")');
      await expect(page.locator('#display')).toHaveText('5.');
    });

    test('должен обрабатывать десятичные числа', async ({ page }) => {
      await page.click('button:has-text("3")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("4")');
      await expect(page.locator('#display')).toHaveText('3.14');
    });
  });

  test.describe('Операции', () => {
    test('должен добавлять оператор сложения', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await expect(page.locator('#display')).toHaveText('5+');
    });

    test('должен добавлять оператор вычитания', async ({ page }) => {
      await page.click('button:has-text("8")');
      await page.click('button.operator:has-text("-")');
      await expect(page.locator('#display')).toHaveText('8-');
    });

    test('должен добавлять оператор умножения', async ({ page }) => {
      await page.click('button:has-text("4")');
      await page.click('button.operator:has-text("×")');
      await expect(page.locator('#display')).toHaveText('4×');
    });

    test('должен добавлять оператор деления', async ({ page }) => {
      await page.click('button:has-text("9")');
      await page.click('button.operator:has-text("/")');
      await expect(page.locator('#display')).toHaveText('9/');
    });

    test('должен заменять существующий оператор новым', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button.operator:has-text("-")');
      await expect(page.locator('#display')).toHaveText('5-');
    });
  });

  test.describe('Вычисления', () => {
    test('должен выполнять простое сложение', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('8');
    });

    test('должен выполнять простое вычитание', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.operator:has-text("-")');
      await page.click('button:has-text("3")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('7');
    });

    test('должен выполнять простое умножение', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("×")');
      await page.click('button:has-text("4")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('20');
    });

    test('должен выполнять простое деление', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.operator:has-text("/")');
      await page.click('button:has-text("2")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('5');
    });

    test('должен выполнять сложное выражение', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("×")');
      await page.click('button:has-text("2")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('20');
    });

    test('должен обрабатывать вычисления с десятичными числами', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('8');
    });

    test('должен обрабатывать отрицательные результаты', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("-")');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('-5');
    });

    test('должен обрабатывать умножение на ноль', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("×")');
      await page.click('button:has-text("0")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('0');
    });

    test('должен обрабатывать сложение с нулем', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("0")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('5');
    });
  });

  test.describe('Деление на ноль', () => {
    test('должен показывать "Ошибка" при делении на ноль', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.operator:has-text("/")');
      await page.click('button:has-text("0")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('Ошибка');
    });

    test('должен показывать "Ошибка" при делении на ноль в сложном выражении', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.operator:has-text("/")');
      await page.click('button:has-text("0")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('Ошибка');
    });

    test('не должен считать деление на 0.0 как ошибку', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.operator:has-text("/")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("0")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).not.toHaveText('Ошибка');
    });
  });

  test.describe('Очистка дисплея', () => {
    test('должен очищать дисплей при нажатии кнопки C', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');
      await page.click('button.clear:has-text("C")');
      await expect(page.locator('#display')).toHaveText('0');
    });

    test('должен очищать результат вычисления', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('8');
      
      await page.click('button.clear:has-text("C")');
      await expect(page.locator('#display')).toHaveText('0');
    });
  });

  test.describe('Удаление последнего символа', () => {
    test('должен удалять последний символ', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');
      await page.click('button.operator:has-text("⌫")');
      await expect(page.locator('#display')).toHaveText('12');
    });

    test('должен устанавливать "0" если остался один символ', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("⌫")');
      await expect(page.locator('#display')).toHaveText('0');
    });

    test('должен удалять оператор', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button.operator:has-text("⌫")');
      await expect(page.locator('#display')).toHaveText('5');
    });

    test('должен удалять несколько символов подряд', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("4")');
      await page.click('button.operator:has-text("⌫")');
      await page.click('button.operator:has-text("⌫")');
      await expect(page.locator('#display')).toHaveText('12');
    });
  });

  test.describe('Продолжение вычислений после результата', () => {
    test('должен продолжать вычисления после получения результата', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('8');
      
      await page.click('button.operator:has-text("×")');
      await page.click('button:has-text("2")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('16');
    });

    test('должен заменять результат при вводе нового числа после вычисления', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('8');
      
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await expect(page.locator('#display')).toHaveText('10');
    });
  });

  test.describe('Интеграционные сценарии', () => {
    test('должен выполнять полную последовательность операций', async ({ page }) => {
      // Ввод числа
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await expect(page.locator('#display')).toHaveText('10');
      
      // Добавление оператора
      await page.click('button.operator:has-text("+")');
      await expect(page.locator('#display')).toHaveText('10+');
      
      // Ввод второго числа
      await page.click('button:has-text("5")');
      await expect(page.locator('#display')).toHaveText('10+5');
      
      // Вычисление
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('15');
      
      // Продолжение вычислений
      await page.click('button.operator:has-text("×")');
      await page.click('button:has-text("2")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('30');
      
      // Очистка
      await page.click('button.clear:has-text("C")');
      await expect(page.locator('#display')).toHaveText('0');
    });

    test('должен обрабатывать сложное выражение с несколькими операциями', async ({ page }) => {
      await page.click('button:has-text("2")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await page.click('button.operator:has-text("×")');
      await page.click('button:has-text("4")');
      await page.click('button.operator:has-text("+")');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button.equals:has-text("=")');
      await expect(page.locator('#display')).toHaveText('20');
    });
  });
});

