import { operate } from './calculator.js';

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

const mainScreen = document.getElementById('main-screen');
const operationScreen = document.getElementById('operation-screen');
const historyList = document.getElementById('history-list');

const updateScreens = (fullOp = '') => {
    mainScreen.innerText = currentInput;
    operationScreen.innerText = fullOp;
};

const handleDecimal = () => {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
        updateScreens();
        return;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateScreens(operator ? `${previousInput} ${operator}` : '');
};

const handleNumber = (num) => {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = num;
        shouldResetScreen = false;
    } else {
        currentInput += num;
    }
    updateScreens(operator ? `${previousInput} ${operator}` : '');
};

const handleOperator = (op) => {
    if (operator !== null && !shouldResetScreen) {
        calculateResult();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
    updateScreens(`${previousInput} ${operator}`);
};

const calculateResult = () => {
    if (operator === null || shouldResetScreen) return;
    
    const result = operate(previousInput, currentInput, operator);
    const operationText = `${previousInput} ${operator} ${currentInput} =`;
    
    // Update UI & History
    const li = document.createElement('li');
    li.innerText = `${operationText} ${result}`;
    historyList.prepend(li);

    currentInput = result.toString();
    operator = null;
    shouldResetScreen = true;
    updateScreens(operationText);
};

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.innerText;
        
        if (/[0-9]/.test(val)) {
            handleNumber(val);
        } else if (val === '.') {
            handleDecimal(); 
        } else if (val === 'C') {
            currentInput = '0'; previousInput = ''; operator = null;
            updateScreens();
        } else if (val === '=') {
            calculateResult();
        } else {
            handleOperator(val);
        }
    });
});