let expenseAmount = [];
let balanceAmount = 0;
const amount = document.querySelector('#amount');
const message = document.querySelector('#message');
const expenseType = document.querySelectorAll('input[name="expenseType"]');
const balanceAmountSelector = document.querySelector('#balanceAmount');
const expendituresDiv = document.querySelector('#expenditures');
const filterValue = document.querySelector('#filter');
const messageError = document.querySelector('#messageError');
const amountError = document.querySelector('#amountError');
const expendituresEdit = document.querySelector('#expenditures');
let editMode = false;
let editExpenseId;
window.addEventListener('load', loadData);
expendituresEdit.addEventListener('click', editExpense);
function loadData() {
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
    if (!(parseInt(amount.value) && message.value.trim())) {
        if (!parseInt(amount.value)) {
            amountError.innerHTML = amount.value == 0 ? 'Invalid input' : 'Field is Required';
        }
        if (message.value.trim() === '') {
            messageError.innerHTML = 'Field is Requied';
        }
        return;
    }
    const expenseObj = {
        amount: parseInt(amount.value),
        message: message.value,
        expenseType : expenseType[0].checked ? 'expenditure' : 'income',
        id: Date.now()
    }
    if (editMode) {
        const expenseIndex = expenseAmount.findIndex((item) => `${item.id}` === `${editExpenseId}`);
        const expenseOldData = expenseAmount[expenseIndex];
        expenseAmount.splice(expenseIndex, 1, expenseObj);
        if (expenseObj.expenseType === expenseOldData.expenseType) {
            if (expenseOldData.amount > expenseObj.amount) {
                updateAmount((expenseOldData.amount - expenseObj.amount), expenseOldData.expenseType === 'income' ? 'expenditure' : 'income');
            } else {
                updateAmount((expenseObj.amount - expenseOldData.amount), expenseOldData.expenseType);  
            }
        } else {
            if (expenseObj.expenseType === 'expenditure') {
                updateAmount(expenseObj.amount + expenseOldData.amount, 'expenditure');
            } else {
                updateAmount(expenseObj.amount + expenseOldData.amount, 'income');
            }
        }
        saveData(expenseObj, expenseIndex);
        applyFilter()
        editMode = false;
    } else {
        expenseAmount.unshift(expenseObj);
        updateAmount(expenseObj.amount, expenseType[0].checked ? 'expenditure':'income');
        saveData(expenseObj);
        if (filterValue.value==='all' ||  filterValue.value=== expenseObj.expenseType)
        {
            renderExpenseItems([expenseObj]);
        }
    }
    resetForm();
}

function saveData(expenseObj, expenseIndex) {
    const storedData = JSON.parse(localStorage.getItem('expenseData')) || [];
    if (expenseIndex) {
        storedData.splice(expenseIndex, 1, expenseObj);
    } else {
        storedData.unshift(expenseObj);
    }
    localStorage.setItem('expenseData', JSON.stringify(storedData));
}

function editExpense(e) {
    e.stopPropagation();
    if (e.target.classList.contains('fa') || e.target.classList.contains('expenditures__edit')) {
        editMode = true;
        if (e.target.classList.contains('fa')) {
            editExpenseId = e.target.closest('.expenditures__edit').getAttribute('data-expense-id');
        } else {
            editExpenseId = e.target.getAttribute('data-expense-id');
        }
        const expenseObj = expenseAmount.find((item) => `${item.id}` === `${editExpenseId}`);
        amount.value = parseInt(expenseObj.amount);
        message.value = expenseObj.message;
        if (expenseObj.expenseType === 'expenditure') {
            expenseType[0].checked = true;
        } else {
            expenseType[1].checked = true;
        }
    }
}

function renderExpenseItems(items) {
    const expenseItems = [];
    items.forEach((item) => {
        const isExpenditure = item.expenseType === 'expenditure';
        const expenseDiv = `<div class="expenditures__item expenditures__item--${isExpenditure ? 'spent' : 'earned'}">
        ${item.amount} ${ isExpenditure ? 'spent on' : 'earned from'} ${item.message}
        <span data-expense-id="${item.id}" class="expenditures__edit" id="editExpense"><i class="fa fa-pencil"></i></span>
        </div>`;
        expenseItems.push(expenseDiv);
    });
    expendituresDiv.insertAdjacentHTML('afterbegin', expenseItems.join(''));
}

function resetForm() {
    amountError.innerHTML = '';
    messageError.innerHTML = '';
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