// Fonction pour récupérer le panier depuis le localStorage
function getCart() {
    const cart = localStorage.getItem('cafeMaraisCart');
    return cart ? JSON.parse(cart) : [];
}

// Fonction pour sauvegarder le panier dans le localStorage
function saveCart(cart) {
    localStorage.setItem('cafeMaraisCart', JSON.stringify(cart));
}

// Fonction pour ajouter un article au panier
function addToCart(productId, quantity, options) {
    const cart = getCart();
    // Créer un ID unique pour l'article du panier basé sur ses options
    const cartItemId = productId + '-' + Object.values(options).join('-');

    const existingItem = cart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ cartItemId, productId, quantity, options });
    }
    saveCart(cart);
}

// Fonction pour changer la quantité d'un article
function updateCartQuantity(cartItemId, newQuantity) {
    let cart = getCart();
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            // Si la quantité est 0 ou moins, on supprime l'article
            cart = cart.filter(item => item.cartItemId !== cartItemId);
        }
        saveCart(cart);
    }
}

// Fonction pour vider le panier
function clearCart() {
    localStorage.removeItem('cafeMaraisCart');
}

// Fonction pour calculer le prix total
function calculateTotal() {
    const cart = getCart();
    let total = 0;

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            let itemPrice = product.price || 0;
            // Si le produit a des options (comme la taille)
            if (product.options && product.options.size && cartItem.options.size) {
                 const sizeOption = product.options.size.find(s => s.name === cartItem.options.size);
                 if(sizeOption) itemPrice = sizeOption.price;
            }
            // Ajouter le prix des suppléments
            if (product.options && product.options.supplements && cartItem.options.supplements) {
                cartItem.options.supplements.forEach(supName => {
                    const sup = product.options.supplements.find(s => s.name === supName);
                    if(sup) itemPrice += sup.price;
                });
            }
            total += itemPrice * cartItem.quantity;
        }
    });
    
    // Ajout de frais fixes (si nécessaire)
    // const deliveryFee = 5.00;
    // return total + deliveryFee;
    return total;
}