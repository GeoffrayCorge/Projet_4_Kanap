const url = new URL(location.href);
const search_params = new URLSearchParams(url.search);

const id = search_params.get('id')

fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())  //transforme le résultat en json (lisible pour JS)
    .then(function (data) {
        displayProduct(data)
    })
    .catch(error => alert(error)) // si API down, ceci retourne une erreur à l'utilisateur


function displayProduct({ _id, altTxt, name, imageUrl, colors, price, description }) {         //fonction qui créer le HTML en fonction de l'ID (modification du DOM)
    if (id === _id) {
        document.getElementsByClassName('item__img')[0].innerHTML += `<img src = '${imageUrl}' alt="${altTxt}" />`;
        document.getElementById('title').innerHTML += `${name}`;
        document.getElementById('price').innerHTML += `${price}`;
        document.getElementById('description').innerHTML += `${description}`;
        colors.forEach((color) => {
            document.getElementById('colors').innerHTML += `<option value='${color}'> ${color} </option>`

        })
        document.querySelector('title').innerHTML = `${name}`
    }
}


const colors = document.getElementById('colors');
const quantityTag = document.getElementById('quantity');
const buttonCart = document.getElementById('addToCart');


buttonCart.addEventListener('click', (e) => {       //fonction qui s'exécute au clique sur le bouton "Ajouter au panier"
    let color = colors.options[colors.selectedIndex].value;
    let quantity = quantityTag.value;
    addItemCart(color, Number(quantity), id);
})

function addItemCart(color, quantity, id) {  //fonction qui permet d'ajouter les produits au panier
    if (color === '') {
        alert('Veuillez choisir une couleur') //message d'erreur si la couleur n'est pas choisie
    }
    else if (quantity < 1 || quantity > 100) {
        alert('Veuillez choisir une quantité') //message d'erreur si la quantité est égale à 0
    }
    else {
        cartToLocalStorage(color, quantity, id)
    }
}

function cartToLocalStorage(color, quantity, id) {
    const itemCart = {          //création de l'objet itemCart qui contiendra l'ID, la quantité et la couleur
        id: id,
        quantity: quantity,
        color: color
    }
    const data = localStorage.getItem('cart');    //on extrait les produits présents dans le panier du local storage
    const cart = data ? JSON.parse(data) : []; //si data est défini, on convertit data avec JSON.parse, sinon, on fait l'expression après les : => tableau vide dans cart (affectation ternaire) 
    const find = cart.find((item) => item.id === id && item.color === color) //recherche un élément dans un tableau en fonction de ces paramètres => on va attribuer à la constante find les items présent dans le panier qui ont la même id et la même couleur aux items séléctionnés par le client
    if (find) {      //si la constante find comprend des articles 
        find.quantity = Number(find.quantity) + Number(quantity)
    } else {
        cart.push(itemCart)   //sinon on envoie l'objet itemCart dans la constante cart
    }
    localStorage.setItem('cart', JSON.stringify(cart))        //on envoie la constante cart dans le local storage  
    alert('Produit ajouté au panier')
}

