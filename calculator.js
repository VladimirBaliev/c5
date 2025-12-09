/**
 * Класс Calculator для выполнения математических операций
 */
export class Calculator {
    constructor() {
        this.currentInput = '0';
        this.shouldResetDisplay = false;
    }

    /**
     * Получить текущее значение дисплея
     * @returns {string} Текущее значение
     */
    getDisplay() {
        return this.currentInput;
    }

    /**
     * Добавить число к текущему вводу
     * @param {string} number - Цифра для добавления
     */
    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        if (this.currentInput === '0') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }
    }

    /**
     * Добавить десятичную точку
     */
    appendDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
    }

    /**
     * Добавить оператор к текущему вводу
     * @param {string} operator - Оператор (+, -, *, /)
     */
    appendOperator(operator) {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
        }
        
        const lastChar = this.currentInput[this.currentInput.length - 1];
        if (['+', '-', '*', '/'].includes(lastChar)) {
            this.currentInput = this.currentInput.slice(0, -1) + operator;
        } else {
            this.currentInput += operator;
        }
    }

    /**
     * Выполнить вычисление текущего выражения
     * @returns {string} Результат вычисления или 'Ошибка'
     */
    calculate() {
        try {
            // Заменяем × на * для вычисления
            let expression = this.currentInput.replace(/×/g, '*');
            
            // Проверяем на деление на ноль (но не /0. или /0.5 и т.д.)
            // Используем регулярное выражение для точной проверки
            if (/\/0(?!\.|\d)/.test(expression)) {
                this.currentInput = 'Ошибка';
                this.shouldResetDisplay = true;
                return 'Ошибка';
            }
            
            const result = Function('"use strict"; return (' + expression + ')')();
            
            if (isNaN(result) || !isFinite(result)) {
                this.currentInput = 'Ошибка';
                this.shouldResetDisplay = true;
                return 'Ошибка';
            } else {
                this.currentInput = result.toString();
                this.shouldResetDisplay = true;
                return this.currentInput;
            }
        } catch (error) {
            this.currentInput = 'Ошибка';
            this.shouldResetDisplay = true;
            return 'Ошибка';
        }
    }

    /**
     * Очистить дисплей
     */
    clearDisplay() {
        this.currentInput = '0';
        this.shouldResetDisplay = false;
    }

    /**
     * Удалить последний символ
     */
    deleteLast() {
        if (this.shouldResetDisplay) {
            this.clearDisplay();
            return;
        }
        
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    }
}

