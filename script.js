//function to perform the operations
function add (x,y) {
    return x+y;
}
function subtract (x,y) {
    return x-y;
}
function multiply (x,y) {
    return x*y;
}
function divide (x,y) {
    if (y === 0) return "Can't divide by 0, dude!";
    return x/y;
}
function modulo (x,y) {
    if (y === 0) return "Can't divide by 0, dude!";
    return x%y;
}

//function to operate
function operate (x, y, operator) {
    let result;
    if      (operator === "+") result = add(x, y);
    else if (operator === "-") result = subtract(x, y);
    else if (operator === "x") result = multiply(x, y);
    else if (operator === "÷") result = divide(x, y);
    else if (operator === "%") result = modulo(x, y);
    return result;
}

//get value clicked on screen by user
function getValue(idValue) {
    const btn = document.querySelector("#"+idValue);
    return btn.textContent;
}

//get and standardize keyboard value
function getKeyboardValue (val) {
    let standardVal;
    if (val === "NumpadEnter" || val === "Enter" || val === "Equal") standardVal = "=";
    else if (val.includes("Digit")) standardVal = val.slice(5,6);
    else if (val === "NumpadMultiply" || val === "*") standardVal = "x";
    else if (val === "NumpadAdd" || val === "+") standardVal = "+";
    else if (val === "NumpadSubtract" || val === "-") standardVal = "-";
    else if (val === "NumpadDivide" || val === "/") standardVal = "÷";
    else if (val === "NumpadDecimal" || val === "Period" || val === ".") standardVal = "."; 
    else if (val.includes("Numpad")) standardVal = val.slice(6,7);
    else if (val === "%" || val === "Percent") standardVal = "%";
    else if (val === "Backspace" || val === "Delete") standardVal = "Clear";
    return standardVal;
 }

//display result to dp number of decimal places - default is 10 decimal places
function displayAnswer (ans, dp=10) {
    if (isNaN(ans)) return ans;
    return Number((ans).toFixed(dp));
 }

//get reference to the display
const upperDisplay = document.querySelector("#sub-display-1");
const lowerDisplay = document.querySelector("#sub-display-2");
upperDisplay.textContent = "0";
//lowerDisplay.textContent = "0";

function calculate(e) {

    let value;
    //this prevent the enter button from submitting the value of the currently active screen button by default 
    //so that the enter button will just act as =
    e.preventDefault(); 
    if (e.type === "click") value = getValue(e.target.id);
    else if (e.type === "keydown") value = getKeyboardValue(e.code);

    //collect values to display on screen
    if (Number.isInteger(parseInt(value)) || value === ".") {
        if (operator === undefined) {
            if (leftSide === undefined && value !== ".") leftSide = value;
            else if (leftSide === "0" && value !== ".") leftSide = value;
            else if (leftSide === "0" && value === "0");//do nothing with leading zeros
            else if (leftSide !== undefined && leftSide.includes(".") && value === ".");//do nothing with multiple decimals
            else if (leftSide === undefined && value === ".") leftSide = "0"+value;//if first value is . add 0 in front
            else leftSide += value;
        } else if (answer === undefined) {
            if (rightSide === undefined && value !== ".") rightSide = value;
            else if (rightSide === "0" && value !== ".") rightSide = value;
            else if (rightSide === "0" && value === "0");//do nothing with leading zeros
            else if (rightSide !== undefined && rightSide.includes(".") && value === ".");//do nothing with multiple decimals
            else if (rightSide === undefined && value === ".") rightSide = "0"+value;//if first value is . add 0 in front
            else rightSide += value;
        } else if (answer !== undefined) { //clear to start new calculate if user punch a number after getting answer
            if (value === ".") leftSide = "0"+value;
            else leftSide = value;
            rightSide = undefined;
            leftSign = "";
            rightSign = "";
            operator = undefined;
            upperScreenText = undefined;
            answer = undefined;
            //upperDisplay.textContent = "0";
            lowerDisplay.textContent = "";
        };
    } else if (value === "+/-" && answer === undefined) {
        if (rightSide !== undefined && rightSign === "" && rightSide !== "0") rightSign = "-";
        else if (rightSide !== undefined && rightSign === "-") rightSign = "";
        else if (operator === undefined && leftSide !== undefined && leftSide !== "0" && leftSign === "") leftSign = "-";
        else if (operator === undefined && leftSide !== undefined && leftSign === "-") leftSign = "";
    } else if (value === "+" || value === "-" || value === "x" || value === "÷" || value === "%") {
        if (rightSide === undefined && leftSide !== undefined) operator = value;
        //allow to enter multiple operations before hitting equals button
        //allow to continue calculations after first answer
        else if (answer === undefined && rightSide !== undefined) {
            let x = parseFloat(leftSign+leftSide);
            let y = parseFloat(rightSign+rightSide);
            if (!isNaN(operate(x, y, operator))){
                leftSide = displayAnswer(operate(x, y, operator)).toString();
                rightSide = undefined;
                rightSign = "";
                operator = value;
            } else {
                answer = operate(x, y, operator);
            };
        }
        else if (answer !== undefined && !isNaN(answer)) {
            leftSide = displayAnswer(answer).toString();
            operator = value;
            rightSide = undefined;
            rightSign = "";
            answer = undefined;
            lowerDisplay.textContent = "";
        };
    } else if (value === "=")  {
        if (leftSide !== undefined && rightSide !== undefined && operator !== undefined && answer === undefined) {
            let x = parseFloat(leftSign+leftSide);
            let y = parseFloat(rightSign+rightSide);
            answer = operate(x, y, operator);
        } else if (leftSide !== undefined && rightSide !== undefined && operator !== undefined && !isNaN(answer)) {
            let x = answer;
            leftSign = "";
            leftSide = displayAnswer(answer).toString();
            let y = parseFloat(rightSign+rightSide);
            answer = operate(x, y, operator);
        }
    } else if (value === "Clear")  {
        leftSide = undefined;
        rightSide = undefined;
        leftSign = "";
        rightSign = "";
        operator = undefined;
        upperScreenText = undefined;
        answer = undefined;
        upperDisplay.textContent = "0";
        lowerDisplay.textContent = "";
    }

    if (leftSide !== undefined) upperScreenText = leftSign.concat(leftSide);
    if (operator !== undefined) upperScreenText = leftSign.concat(leftSide).concat(" ", operator);
    if (rightSide !== undefined) upperScreenText = leftSign.concat(leftSide).concat(" ", operator).concat(" ", rightSign, rightSide);
    if (upperScreenText !== undefined) upperDisplay.textContent = upperScreenText;
    if (answer !== undefined) lowerDisplay.textContent = displayAnswer(answer); //max is 10 decimal place
}

let leftSide;
let rightSide;
let leftSign = "";//default is no sign which positive
let rightSign = "";//default is no sign which positive
let operator;
let upperScreenText;
let answer;

//---------listen for clicks-------------
const keys = document.querySelectorAll(".keypad-unit");
keys.forEach(key => key.addEventListener("click", calculate));

//----Listen for input from keyboard------
window.addEventListener('keydown', calculate);