fetch('http://localhost:3000/api/products')
    .then(res => res.json())  //transforme le résultat en json (lisible pour JS)
    .then(function (data) {
        displayProduct(data)
    })
    .catch(error => alert(error)) // si API down, ceci retourne une erreur à l'utilisateur



function displayProduct(products) {                      //Modifie le DOM avec une chaîne de caractère
    let displayProducts = '';
    for (let item of products) {
        displayProducts += `<a href='product.html?id=${item._id}'>
                                <article>
                                    <img src = '${item.imageUrl}' alt="${item.altTxt}" />
                                    <h3>${item.name}</h3>
                                    <p>${item.description}</p>
                                </article>
                            </a>
                            `;
    }
    document.getElementById('items').innerHTML = displayProducts;

}






