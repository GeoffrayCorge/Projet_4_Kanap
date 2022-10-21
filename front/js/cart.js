const data = localStorage.getItem('cart');   //on attribue les produits présent dans le local storage dans la constante data
const cart = data ? JSON.parse(data) : []; //si data est défini, on convertit data avec JSON.parse, sinon, on fait l'expression après les ':' => tableau vide dans cart

const cartItem = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');
let sumQuantity = 0;
let sumPrice = 0;


init();

async function init() {             //Affiche les produits présents dans le local Storage
    cart.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0));  //Permets de trier les produits présent dans le panier par ordre croissant en fonction de l'ID
    for (let item of cart) {
        const data = await fetch(`http://localhost:3000/api/products/${item.id}`);
        const product = await data.json(); //
        displayItemCart(item, product);
        sumQuantity = Number(sumQuantity) + Number(item.quantity);
        totalQuantity.textContent = sumQuantity
    }
}


function displayItemCart(item, product) {   //fonction qui va permettre de créer le HTML
    const article = document.createElement('article');  //création de la balise article
    article.setAttribute('class', 'cart__item');   //on attribue la classe que l'on veut à l'article
    article.setAttribute('data-id', item.id);  // on lui attribue le data-id
    article.setAttribute('data-color', item.color); // ainsi que le data-color
    cartItem.appendChild(article);  //on fait de la balise article l'enfant direct de la section avec l'id cart__items

    const div = document.createElement('div');
    div.classList.add('cart__item__img');
    article.appendChild(div);

    const img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);
    div.appendChild(img);

    const div2 = document.createElement('div');
    div2.classList.add('cart__item__content');
    article.appendChild(div2);

    const div3 = document.createElement('div');
    div3.classList.add('cart__item__content__description');
    div2.appendChild(div3);

    const name = document.createElement('h2');
    div3.appendChild(name);
    name.textContent = product.name;

    const color = document.createElement('p');
    div3.appendChild(color);
    color.textContent = item.color;

    const price = document.createElement('p');
    div3.appendChild(price);
    price.textContent = `${product.price} €`;

    const div4 = document.createElement('div');
    div4.classList.add('cart__item__content__settings');
    div2.appendChild(div4);

    const div5 = document.createElement('div');
    div5.classList.add('cart__item__content__settings__quantity');
    div4.appendChild(div5);

    const quantity = document.createElement('p');
    div5.appendChild(quantity);
    quantity.textContent = 'Qté :', item.quantity;

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('class', 'itemQuantity');
    input.setAttribute('name', 'itemQuantity');
    input.setAttribute('min', 1);
    input.setAttribute('max', 100);
    input.setAttribute('value', item.quantity);
    div5.appendChild(input);
    input.addEventListener('change', (event) => {     
        if (Math.sign(input.value) === -1 || Math.sign(input.value) === 0) {
            alert ('Veuillez choisir une quantité correcte !')
        }         
        handlerChangeQuantityItem(event, input, item, product)       //Permets de changer la quantité sur la page panier
    });

    const div6 = document.createElement('div');
    div6.classList.add('cart__item__content__settings__delete');
    div4.appendChild(div6);

    const deleteItem = document.createElement('p');
    deleteItem.classList.add('deleteItem');
    div6.appendChild(deleteItem);
    deleteItem.textContent = 'Supprimer';
    deleteItem.addEventListener('click', (e) => {
        handlerClickDeleteItem(e, deleteItem, item, product)
    });

    sumPrice = Number(sumPrice) + (Number(product.price) * Number(item.quantity));
    totalPrice.textContent = sumPrice
}
function handlerClickDeleteItem(e, deleteItem, item, product) {                    //Supprime le prooduit séléctionné
    const elementToDelete = deleteItem.closest('article');
    elementToDelete.remove();
    const index = cart.findIndex((item) => (item.color === elementToDelete.dataset.color && item.id === elementToDelete.dataset.id))
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart))
    handlerDeleteItem(item, product);
}

function handlerChangeQuantityItem(event, input, item, product) {          //Modifie la quantité et le prix affichés au changement de quantité
    const elementToChange = input.closest('article');
    const find = cart.find((item) => item.id === elementToChange.dataset.id && item.color === elementToChange.dataset.color);
    const oldQuantity = find.quantity;
    const newQuantity = input.value;
    changeQuantity(item, product, oldQuantity, newQuantity);
    changePrice(item, product, oldQuantity, newQuantity)
    find.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart))
}

function handlerDeleteItem(item, product) {             //Modifie la quantité et le prix affichés à la suppression du produit
    sumQuantity = Number(sumQuantity) - Number(item.quantity);
    totalQuantity.textContent = sumQuantity
    sumPrice = Number(sumPrice) - (Number(item.quantity) * Number(product.price));
    totalPrice.textContent = sumPrice;
}

function changePrice(item, product, oldQuantity, newQuantity) {                         //Mofifie le prix au changement de quantité
    const oldPrice = Number(product.price) * Number(oldQuantity);
    const newPrice = (Number(product.price) * Number(newQuantity));
    sumPrice = Number(sumPrice) - Number(oldPrice) + Number(newPrice);
    totalPrice.textContent = sumPrice
}

function changeQuantity(item, product, oldQuantity, newQuantity) {      //Mofifie la quantité au changement de quantité
    sumQuantity = Number(sumQuantity) - Number(oldQuantity) + Number(newQuantity);
    totalQuantity.textContent = sumQuantity;
}

let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');
let order = document.getElementById('order');

let regex = new RegExp('[a-zA-Z][^0-9]$');
let regexEmail = new RegExp('[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}')


let firstNameIsError = true;
let lastNameIsError = true;
let cityIsError = true;
let emailIsError = true;


firstName.addEventListener('input', (event) => {            //Analyse le prénom du formulaire suivant la REGEX mentionnée 
    const value = event.target.value;
    const error = document.getElementById('firstNameErrorMsg');
    firstNameIsError = !regex.test(value);

    if (firstNameIsError) {
        error.textContent = 'Veuillez entrer un prénom valide';
    }
    else {
        error.textContent = ''
    }
})

lastName.addEventListener('input', (event) => {             //Analyse le nom du formulaire suivant la REGEX mentionnée 
    const value = event.target.value;
    const error = document.getElementById('lastNameErrorMsg');
    lastNameIsError = !regex.test(value);

    if (lastNameIsError) {
        error.textContent = 'Veuillez entrer un nom valide';
    }
    else {
        error.textContent = ''
    }
})

city.addEventListener('input', (event) => {                 //Analyse la ville du formulaire suivant la REGEX mentionnée 
    const value = event.target.value;
    const error = document.getElementById('cityErrorMsg');
    cityIsError = !regex.test(value);

    if (cityIsError) {
        error.textContent = 'Veuillez entrer une ville valide';
    }
    else {
        error.textContent = ''
    }
})

email.addEventListener('input', (event) => {                //Analyse l'email du formulaire suivant la REGEX mentionnée 
    const value = event.target.value;
    const error = document.getElementById('emailErrorMsg');
    emailIsError = !regexEmail.test(value);

    if (emailIsError) {
        error.textContent = 'Veuillez entrer une adresse mail valide';
    }
    else {
        error.textContent = ''
    }
})



order.addEventListener('click', (event) => {                    //Permets de passer la commande
    event.preventDefault();  //annule la requête HTTP
    if (cart.length === 0) {
        alert("Vous ne pouvez pas passer commande, ajoutez d'abord des articles au panier")
    } else if (firstName.value === '') {
        alert('Veuillez entrer votre prénom !')
    } else if (lastName.value === '') {
        alert('Veuillez entrer votre nom !')
    } else if (address.value === '') {
        alert('Veuillez entrer votre adresse !')
    } else if (city.value === '') {
        alert('Veuillez entrer votre ville !')
    } else if (email.value === '') {
        alert('Veuillez entrer votre adresse mail !')
    } else {
        if (firstNameIsError || lastNameIsError || cityIsError || emailIsError) {
            return
        }
        const contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        }
        const products = cart.map((item) => item.id);
        console.log(contact);
        console.log(products);

        orderToApi(contact, products);
    }
})

function orderToApi(contact, products) {            //Modifie l'API suivant le formulaire et les produits commandés
    const data = { contact, products }
    console.log(data);
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(data => {
            localStorage.removeItem('cart');
            document.location.href = "../html/confirmation.html?id=" + data.orderId;
        })
        .catch((error) => console.log(error));
};


