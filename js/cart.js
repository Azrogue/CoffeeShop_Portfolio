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
            let itemPrice = 0; // Initialize to 0

            // Determine base price: either from selected size or direct product price
            if (cartItem.options && cartItem.options.size) {
                // If a size option was selected for this cart item
                // cartItem.options.size is an object like { name: "Petit", price: 3.50 }
                itemPrice = cartItem.options.size.price;
            } else if (product.price !== undefined) {
                // If no size option, use the product's base price
                itemPrice = product.price;
            }

            // Add supplement prices
            if (cartItem.options && cartItem.options.supplements && cartItem.options.supplements.length > 0) {
                cartItem.options.supplements.forEach(supObj => {
                    // supObj is an object like { name: "Extra Shot", price: 1.00 }
                    itemPrice += supObj.price;
                });
            }
            total += itemPrice * cartItem.quantity;
        }
    });
    return total;
}