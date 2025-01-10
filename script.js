//seleciona os elementos do formulário
const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const expense = document.querySelector('#expense');
const category = document.querySelector('#category');

//seleciona os elementos da lista
const expenseList = document.querySelector('ul');
const expenseQuantity = document.querySelector('aside header p span');
const expensesTotal = document.querySelector('aside header h2');

//capturando o evento de input para formatar o valor
amount.addEventListener('input', ()=>{
    //obtém o valor atual do input e remove os caracteres não numéricos
    let value = amount.value.replace(/\D/g, '');

    //formatando os centavos (ex: valor / 100 => digitou 150 = 1,50... digitou 4500 = 45,00)
    value = +value / 100;

    //atualiza o valor do input
    amount.value = formatCurrencyBRL(value);
})

//função para formatar o valor
function formatCurrencyBRL(value){
    //formata o valor para o padrão BRL
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    //retorna o valor
    return value;
}

//obtendo o evento do formulário
form.addEventListener('submit', (event)=>{
    event.preventDefault();

    //cria um objeto que armazena as informações da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        create_at: new Date(),
    }

    addExpense(newExpense);
});

//adiciona um novo item na lista
function addExpense(newExpense){
    try {
        //crima o elemento (li) para adicionar o item na lista (ul)
        const expenseItem = document.createElement('li');

        //adiciona a classe de estilização no elemento
        expenseItem.classList.add('expense');

        //cria o ícone da categoria
        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', newExpense.category_name);

        //cria div de informações da despesa
        const expenseInfos = document.createElement('div');
        expenseInfos.classList.add('expense-info');
        expenseInfos.innerHTML = `<strong>${newExpense.expense}</strong> <span>${newExpense.category_name}</span>`;

        //cria o valor da despesa
        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.replace('R$', '')}`;

        //criando icone de remover
        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', 'img/remove.svg');
        removeIcon.setAttribute('alt', 'remover despesa');

        //adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfos, expenseAmount, removeIcon);

        //adiciona o item à lista
        expenseList.append(expenseItem);

        //atualiza o total das despesas
        updateTotals();
        formClear();

    } catch (error) {
        alert('Não foi possível atualizar a lista de despesas')
       console.log(error) 
    }
}

//atualiza o total de itens na lista
function updateTotals(){
    try {
        //recupera todos os itens da lista
        const items = expenseList.children;

        //atualiza o total de despesas
        expenseQuantity.innerText = `${items.length} ${items > 1 ? 'despesas' : 'despesa'}`

        //variável par incrementar o total
        let total = 0;

        //percorre cada item da lista
        for(let item = 0; item < items.length; item++){
            let itemAmount = items[item].querySelector('.expense-amount').innerText.replace(/[^\d,]/g, '').replace(',', '.');

            let value = +itemAmount;

            if(isNaN(value)){
                return alert("Não foi possível calcular o total. O valor não parece ser um número");
            }

            total += value;
        }

        total = formatCurrencyBRL(total).replace('R$', '');

        expensesTotal.innerHTML = `<small>R$</small>${total}`;
    } catch (error) {
        alert('Não foi possível atualizar o total das despesas')
        console.log(error)
    }
}

//captura o clique nos itens da lista
expenseList.addEventListener('click', (event)=>{
    //verifica se o elemento clicado é o ícone de remover
    if(event.target.classList.contains('remove-icon')){

        //obtém a li pai do elemento clicado
        const item = event.target.closest('.expense');

        //remove o item da lista
        item.remove();
    }

    //atualiza os totais
    updateTotals();
});

//limpa os campos de input
function formClear(){
    expense.value = '';
    category.value = '';
    amount. value = '';

    expense.focus();
}