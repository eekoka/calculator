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
    return x/y;
}
function modulo (x,y) {
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

function getValue(idValue) {
    const btn = document.querySelector("#"+idValue);
    return btn.textContent;
}



//get reference to the display
const upperDisplay = document.querySelector("#sub-display-1");
const lowerDisplay = document.querySelector("#sub-display-2");
upperDisplay.textContent = "0";
//lowerDisplay.textContent = "0";

let leftSide;
let rightSide;
let leftSign = "";//default is no sign which positive
let rightSign = "";//default is no sign which positive
let operator;
let upperScreenText;
let answer;

//listen for clicks
const keys = document.querySelectorAll(".keypad-unit");
keys.forEach(key => key.addEventListener("click",(e)=>{
    let value = getValue(e.target.id);
    //collect values to display on screen
    if (Number.isInteger(parseInt(value)) || value === ".") {
        if (operator === undefined) {
            if (leftSide === undefined && value !== ".") leftSide = value;
            else if (leftSide === "0" && value !== ".") leftSide = value;
            else if (leftSide === "0" && value === "0");//do nothing with leading zeros
            else if (leftSide !== undefined && leftSide.includes(".") && value === ".");//do nothing with multiple decimals
            else if (leftSide === undefined && value === ".") leftSide = "0"+value;//if first value is . add 0 in front
            else leftSide += value;
        } else {
            if (rightSide === undefined && value !== ".") rightSide = value;
            else if (rightSide === "0" && value !== ".") rightSide = value;
            else if (rightSide === "0" && value === "0");//do nothing with leading zeros
            else if (rightSide !== undefined && rightSide.includes(".") && value === ".");//do nothing with multiple decimals
            else if (rightSide === undefined && value === ".") rightSide = "0"+value;//if first value is . add 0 in front
            else rightSide += value;
        };
    } else if (value === "+/-") {
        if (rightSide !== undefined && rightSign === "" && rightSide !== "0") rightSign = "-";
        else if (rightSide !== undefined && rightSign === "-") rightSign = "";
        else if (operator === undefined && leftSide !== undefined && leftSide !== "0" && leftSign === "") leftSign = "-";
        else if (operator === undefined && leftSide !== undefined && leftSign === "-") leftSign = "";
    } else if (value === "+" || value === "-" || value === "x" || value === "÷" || value === "%") {
        if (operator === undefined && leftSide !== undefined) operator = value;
    } else if (value === "=")  {
        if (leftSide !== undefined && rightSide !== undefined || operator !== undefined) {
            let x = parseFloat(leftSign+leftSide);
            let y = parseFloat(rightSign+rightSide);
            answer = operate(x, y, operator);
        }
    } else if (value === "Clear")  {
        leftSide = undefined;
        rightSide = undefined;
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
    if (answer !== undefined) lowerDisplay.textContent = answer;
}));


