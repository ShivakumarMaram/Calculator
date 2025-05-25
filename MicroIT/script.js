const display = document.getElementById('display');
let currentInput = '0';

function appendToDisplay(value) {
    // Prevent multiple decimals in a single number
    if (value === '.' && currentInput.split(/[\+\-\*\/]/).pop().includes('.')) {
        return;
    }
    // Prevent consecutive operators
    if (['+', '-', '*', '/', '%'].includes(value) && ['+', '-', '*', '/', '%'].includes(currentInput.slice(-1))) {
        currentInput = currentInput.slice(0, -1) + value;
    } else if (currentInput === '0' && value !== '.' && !['+', '-', '*', '/', '%'].includes(value)) {
        currentInput = value;
    } else if (currentInput === 'Error') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    display.value = currentInput;
}

function calculate() {
    try {
        const expression = currentInput.replace(/%/g, '/100');
        const result = eval(expression);
        if (!Number.isFinite(result) || isNaN(result)) {
            throw new Error('Invalid calculation');
        }
        // Limit to 8 decimal places to prevent overflow display
        currentInput = Number(result.toFixed(8)).toString();
        display.value = currentInput;
    } catch (error) {
        currentInput = 'Error';
        display.value = currentInput;
        setTimeout(clearDisplay, 1000);
    }
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    event.preventDefault(); // Prevent browser shortcuts
    const key = event.key;
    if (/[0-9]/.test(key)) appendToDisplay(key);
    else if (key === '+' || key === '-' || key === '*' || key === '/') appendToDisplay(key);
    else if (key === 'Enter') calculate();
    else if (key === 'Escape') clearDisplay();
    else if (key === '.') appendToDisplay('.');
    else if (key === '%') appendToDisplay('%');
    else if (key === '(' || key === ')') appendToDisplay(key);
});