let expenseAmount = [];
let balanceAmount = 0;
let amount;
let message;
let expenseType;
let balanceAmountSelector;
let expendituresDiv;
let filterValue;
window.addEventListener('load', loadData);

function loadData() {
    amount = document.querySelector('#amount');
    message = document.querySelector('#message');
    expenseType = document.getElementsByName('expenseType');
    balanceAmountSelector = document.querySelector('#balanceAmount');
    expendituresDiv = document.querySelector('#expenditures');
    filterValue = document.getElementById('filter');
    balanceAmountSelector.innerHTML = 0;
    loadInitialData();
}

function loadInitialData() {
    const storedData = JSON.parse(localStorage.getItem('expenseData')) || [];
    expenseAmount = [...storedData];
    renderExpenseItems(storedData);
    storedData.forEach(element => {
        updateAmount(element.amount,element.expenseType);
    });
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
    const expenseObj = {
        amount: amount.value,
        message: message.value,
        expenseType : expenseType[0].checked ? 'expenditure' : 'income'
    }
    expenseAmount.unshift(expenseObj);
    updateAmount(expenseObj.amount, expenseType[0].checked ? 'expenditure':'income');
    saveData(expenseObj.amount,expenseObj.message, expenseObj.expenseType);
    if (filterValue.value==='all' ||  filterValue.value=== expenseObj.expenseType)
    { 
        renderExpenseItems([expenseObj]);
    }
    resetForm();
}

function saveData(amount, message, expenseType) {
    const storedData = JSON.parse(localStorage.getItem('expenseData')) || [];
    storedData.unshift({
        amount,
        message,
        expenseType
    });
    localStorage.setItem('expenseData', JSON.stringify(storedData));
}

function renderExpenseItems(items) {
    const expenseItems = [];
    items.forEach((item) => {
        const expenseDiv = `<div>${item.amount} ${item.expenseType === 'expenditure' ? 'spent on' : 'earned from'} ${item.message}</div>`;
        expenseItems.push(expenseDiv);
    });
    expendituresDiv.insertAdjacentHTML('afterbegin', expenseItems.join(''));
}

function resetForm() {
    amount.value = '';
    message.value = '';
}

function applyFilter() {
    expendituresDiv.innerHTML = '';
    if (filterValue.value==='expenditure') {
        const filteredExpenseAmount  = expenseAmount.filter((item) => item.expenseType === 'expenditure');
        renderExpenseItems(filteredExpenseAmount);
    } else if (filterValue.value==='income') {
        const filteredExpenseAmount  = expenseAmount.filter((item) => item.expenseType === 'income');
        renderExpenseItems(filteredExpenseAmount);
    } else {
        renderExpenseItems(expenseAmount);
    }
}