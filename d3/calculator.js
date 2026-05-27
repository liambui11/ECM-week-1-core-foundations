export const operate = (a, b, operator) => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    if (isNaN(num1) || isNaN(num2)) return b;

    switch (operator) {
        case '+': return parseFloat((num1 + num2).toFixed(10));
        case '-': return parseFloat((num1 - num2).toFixed(10));
        case '×': return parseFloat((num1 * num2).toFixed(10));
        case '÷': return num2 === 0 ? "Error" : parseFloat((num1 / num2).toFixed(10));
        default: return b;
    }
};