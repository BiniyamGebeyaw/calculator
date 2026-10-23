
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }
}


let firstNumber = null;
let operator = null;
let secondNumber = null;

let displayValue = "0";
let resetDisplay = false;
let hasError = false;
const MAX_DIGITS = 12;

const display = document.getElementById("display");
const decimalButton = document.querySelector('[data-action="decimal"]');

function updateDisplay() {
  display.textContent = displayValue;

  decimalButton.disabled = displayValue.includes(".") && !resetDisplay;
}


function formatResult(number) {
  const rounded = String(parseFloat(number.toPrecision(MAX_DIGITS)));
  return rounded.length > MAX_DIGITS + 3 ? number.toExponential(5) : rounded;
}

function showError() {
  displayValue = "Nope, can't divide by 0!";
  firstNumber = null;
  operator = null;
  secondNumber = null;
  resetDisplay = true;
  hasError = true;
}

function compute() {
  secondNumber = Number(displayValue);

  if (operator === "/" && secondNumber === 0) {
    showError();
    return false;
  }

  displayValue = formatResult(operate(operator, firstNumber, secondNumber));
  firstNumber = Number(displayValue);
  return true;
}


function inputDigit(digit) {
  hasError = false;
  if (resetDisplay) {
    displayValue = digit;
    resetDisplay = false;
  } else if (displayValue === "0") {
    displayValue = digit;
  } else if (displayValue.replace(/[-.]/g, "").length < MAX_DIGITS) {
    displayValue += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  hasError = false;
  if (resetDisplay) {
    displayValue = "0.";
    resetDisplay = false;
  } else if (!displayValue.includes(".")) {
    displayValue += ".";
  }
  updateDisplay();
}

function chooseOperator(newOperator) {
  if (hasError) return;

  if (operator !== null && !resetDisplay) {
    if (!compute()) {
      updateDisplay();
      return;
    }
  } else if (operator === null) {
    firstNumber = Number(displayValue);
  }

  operator = newOperator;
  resetDisplay = true;
  updateDisplay();
}

function equals() {
  if (hasError || operator === null || resetDisplay) return;

  if (compute()) {
    operator = null;
    resetDisplay = true;
  }
  updateDisplay();
}

function backspace() {
  if (hasError || resetDisplay) return;
  displayValue = displayValue.slice(0, -1);
  if (displayValue === "" || displayValue === "-") {
    displayValue = "0";
  }
  updateDisplay();
}

function clearAll() {
  firstNumber = null;
  operator = null;
  secondNumber = null;
  displayValue = "0";
  resetDisplay = false;
  hasError = false;
  updateDisplay();
}

function handleAction(action, value) {
  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "operator":
      chooseOperator(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "equals":
      equals();
      break;
    case "backspace":
      backspace();
      break;
    case "clear":
      clearAll();
      break;
  }
}

document.querySelector(".keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  handleAction(button.dataset.action, button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const key = event.key;
  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "=" || key === "Enter") {
    equals();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearAll();
  } else {
    return;
  }
  event.preventDefault();
});

updateDisplay();
