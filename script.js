let expenseAmount = [];
let balanceAmount = 0;
let expenseItems = [];
let amount;
let message;
let expenseType;
let balanceAmountSelector;
let expendituresDiv;
window.addEventListener('load', loadData);

function loadData() {
    amount = document.querySelector('#amount');
    message = document.querySelector('#message');
    expenseType = document.getElementsByName('expenseType');
    balanceAmountSelector = document.querySelector('#balanceAmount');
    expendituresDiv = document.querySelector('#expenditures');
    balanceAmountSelector.innerHTML = 0;
    loadInitialData();
}

function loadInitialData() {
    const storedData = JSON.parse(localStorage.getItem('expenseData')) || [];
    const expenseElement = [];
    storedData.forEach(element => {
        const expenseDiv = `<div>${element.amount} ${element.expenseType === 'expenditure' ? 'spent on' : 'earned from'} ${element.message}</div>`;
        expenseElement.push(expenseDiv);
        updateAmount(element.amount,element.expenseType);
    });
    expendituresDiv.insertAdjacentHTML('afterbegin', expenseElement.join(''));
}

function updateAmount(amount, expenseType) {
    if (expenseType === 'expenditure') {
        balanceAmount -= parseInt(amount);
    } else {
        balanceAmount += parseInt(amount);
    }
    balanceAmountSelector.innerHTML = balanceAmount;
}

function amountSubmitted() {
    if (!(amount.value && message.value)) {
        return;
    }
    updateAmount(amount.value, expenseType[0].checked ? 'expenditure':'income');
    if (expenseType[0].checked) {
        balanceAmount -= parseInt(amount.value);
    } else {
        balanceAmount += parseInt(amount.value);
    }
    expenseAmount.unshift(amount.value);
    saveData(amount.value,message.value, expenseType);
    loadExpenseItem(amount.value,message.value,expenseType);
}

function saveData(amount, message, expenseType) {
    const storedData = JSON.parse(localStorage.getItem('expenseData')) || [];
    storedData.push({
        amount,
        message,
        expenseType : expenseType[0].checked ? 'expenditure' : 'income'
    });
    localStorage.setItem('expenseData', JSON.stringify(storedData));
}

function loadExpenseItem(amount,message, expenseType) {
    const expenseDiv = `<div>${amount} ${expenseType[0].checked ? 'spent on' : 'earned from'} ${message}</div>`;
    expendituresDiv && expendituresDiv.insertAdjacentHTML('afterbegin', expenseDiv);
    resetForm();
}

function resetForm() {
    amount.value = '';
    message.value = '';
}
