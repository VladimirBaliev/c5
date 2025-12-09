import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from './calculator.js';

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('Конструктор и начальное состояние', () => {
        it('должен инициализироваться с "0"', () => {
            expect(calculator.getDisplay()).toBe('0');
        });

        it('должен иметь shouldResetDisplay = false при инициализации', () => {
            expect(calculator.shouldResetDisplay).toBe(false);
        });
    });

    describe('appendNumber', () => {
        it('должен заменить "0" на введенное число', () => {
            calculator.appendNumber('5');
            expect(calculator.getDisplay()).toBe('5');
        });

        it('должен добавить число к существующему значению', () => {
            calculator.appendNumber('5');
            calculator.appendNumber('3');
            expect(calculator.getDisplay()).toBe('53');
        });

        it('должен сбросить дисплей если shouldResetDisplay = true', () => {
            calculator.currentInput = '10';
            calculator.shouldResetDisplay = true;
            calculator.appendNumber('7');
            expect(calculator.getDisplay()).toBe('7');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен обрабатывать несколько цифр подряд', () => {
            calculator.appendNumber('1');
            calculator.appendNumber('2');
            calculator.appendNumber('3');
            calculator.appendNumber('4');
            expect(calculator.getDisplay()).toBe('1234');
        });

        it('должен обрабатывать ноль после других цифр', () => {
            calculator.appendNumber('5');
            calculator.appendNumber('0');
            expect(calculator.getDisplay()).toBe('50');
        });
    });

    describe('appendDecimal', () => {
        it('должен добавить точку к числу', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('5.');
        });

        it('должен добавить точку к "0"', () => {
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('0.');
        });

        it('не должен добавлять вторую точку', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('5.');
        });

        it('должен сбросить дисплей если shouldResetDisplay = true', () => {
            calculator.currentInput = '10';
            calculator.shouldResetDisplay = true;
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('0.');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен добавить точку после оператора', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendDecimal();
            expect(calculator.getDisplay()).toBe('5+.');
        });
    });

    describe('appendOperator', () => {
        it('должен добавить оператор сложения', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            expect(calculator.getDisplay()).toBe('5+');
        });

        it('должен добавить оператор вычитания', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('-');
            expect(calculator.getDisplay()).toBe('5-');
        });

        it('должен добавить оператор умножения', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('*');
            expect(calculator.getDisplay()).toBe('5*');
        });

        it('должен добавить оператор деления', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('/');
            expect(calculator.getDisplay()).toBe('5/');
        });

        it('должен заменить существующий оператор новым', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendOperator('-');
            expect(calculator.getDisplay()).toBe('5-');
        });

        it('должен заменить оператор несколько раз', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendOperator('*');
            calculator.appendOperator('/');
            expect(calculator.getDisplay()).toBe('5/');
        });

        it('не должен сбрасывать shouldResetDisplay при добавлении оператора', () => {
            calculator.shouldResetDisplay = true;
            calculator.appendOperator('+');
            expect(calculator.shouldResetDisplay).toBe(false);
        });
    });

    describe('calculate', () => {
        describe('Положительные сценарии', () => {
            it('должен выполнить простое сложение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('8');
                expect(calculator.getDisplay()).toBe('8');
            });

            it('должен выполнить простое вычитание', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('-');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('7');
            });

            it('должен выполнить простое умножение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('4');
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен выполнить простое деление', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('5');
            });

            it('должен выполнить сложное выражение', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('+');
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен обработать выражение с десятичными числами', () => {
                calculator.appendNumber('5');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('2');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(result).toBe('8');
            });

            it('должен обработать отрицательные числа', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('-');
                calculator.appendNumber('10');
                const result = calculator.calculate();
                expect(result).toBe('-5');
            });

            it('должен обработать деление с результатом меньше единицы', () => {
                calculator.appendNumber('1');
                calculator.appendOperator('/');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('0.5');
            });

            it('должен обработать умножение на ноль', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('0');
            });

            it('должен обработать сложение с нулем', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('5');
            });

            it('должен установить shouldResetDisplay в true после вычисления', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                calculator.calculate();
                expect(calculator.shouldResetDisplay).toBe(true);
            });
        });

        describe('Отрицательные сценарии - деление на ноль', () => {
            it('должен вернуть "Ошибка" при делении на ноль', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
                expect(calculator.getDisplay()).toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при делении на ноль в сложном выражении', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('не должен считать деление на 0.0 как ошибку', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                calculator.appendDecimal();
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).not.toBe('Ошибка');
            });

            it('должен обнаружить деление на ноль даже если в выражении есть /0. в другом месте', () => {
                calculator.currentInput = '10/0.5/0';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('не должен считать деление на 0.5 как ошибку', () => {
                calculator.currentInput = '10/0.5';
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен установить shouldResetDisplay в true после ошибки деления на ноль', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                calculator.calculate();
                expect(calculator.shouldResetDisplay).toBe(true);
            });
        });

        describe('Отрицательные сценарии - некорректные выражения', () => {
            it('должен вернуть "Ошибка" при вычислении только оператора', () => {
                calculator.appendOperator('+');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при некорректном выражении', () => {
                calculator.currentInput = '5++3';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при выражении заканчивающемся на оператор', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обработать деление на ноль как ошибку (проверка через регулярное выражение)', () => {
                calculator.currentInput = '1/0';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обработать NaN как ошибку', () => {
                calculator.currentInput = 'undefined + 5';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });
        });

        describe('Обработка символа ×', () => {
            it('должен заменить × на * при вычислении', () => {
                calculator.currentInput = '5×4';
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен обработать × в сложном выражении', () => {
                calculator.currentInput = '5×2+3';
                const result = calculator.calculate();
                expect(result).toBe('13');
            });
        });
    });

    describe('clearDisplay', () => {
        it('должен сбросить дисплей на "0"', () => {
            calculator.appendNumber('123');
            calculator.clearDisplay();
            expect(calculator.getDisplay()).toBe('0');
        });

        it('должен сбросить shouldResetDisplay в false', () => {
            calculator.shouldResetDisplay = true;
            calculator.clearDisplay();
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен очистить результат вычисления', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.clearDisplay();
            expect(calculator.getDisplay()).toBe('0');
        });
    });

    describe('deleteLast', () => {
        it('должен удалить последний символ', () => {
            calculator.appendNumber('123');
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('12');
        });

        it('должен удалить несколько символов подряд', () => {
            calculator.appendNumber('123');
            calculator.deleteLast();
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('1');
        });

        it('должен установить "0" если остался один символ', () => {
            calculator.appendNumber('5');
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('0');
        });

        it('должен очистить дисплей если shouldResetDisplay = true', () => {
            calculator.currentInput = '10';
            calculator.shouldResetDisplay = true;
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('0');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен удалить оператор', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('5');
        });

        it('должен обработать удаление из "0"', () => {
            calculator.deleteLast();
            expect(calculator.getDisplay()).toBe('0');
        });
    });

    describe('Интеграционные тесты', () => {
        it('должен выполнить полную последовательность операций', () => {
            calculator.appendNumber('1');
            calculator.appendNumber('0');
            calculator.appendOperator('+');
            calculator.appendNumber('5');
            calculator.appendOperator('*');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('30');
        });

        it('должен продолжить вычисления после результата', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            
            calculator.appendOperator('*');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('16');
        });

        it('должен обработать последовательность с очисткой', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.clearDisplay();
            calculator.appendNumber('10');
            calculator.appendOperator('/');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('5');
        });

        it('должен обработать вычисления с десятичными числами', () => {
            calculator.appendNumber('1');
            calculator.appendDecimal();
            calculator.appendNumber('5');
            calculator.appendOperator('*');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('3');
        });
    });
});

