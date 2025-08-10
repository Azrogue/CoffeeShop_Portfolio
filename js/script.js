document.addEventListener('DOMContentLoaded', () => {
    const bodyId = document.body.id;

    // Redirection de la page de chargement
    if (bodyId === 'splash-page') {
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 3000);
    }
    
    // Logique pour chaque page
    if (bodyId === 'menu-page') {
        renderMenu();
    } else if (bodyId === 'product-page') {
        renderProductDetails();
    } else if (bodyId === 'cart-page') {
        renderCartPage();
    } else if (bodyId === 'confirmation-page') {
        runConfirmationSequence();
    }
});

// Affiche le menu complet
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    // Group products by category first
    const productsByCategory = {};
    menuSections.forEach(category => {
        const items = products.filter(p => p.category === category);
        if(items.length > 0) {
            productsByCategory[category] = items;
        }
    });

    for (const category in productsByCategory) {
        let sectionHtml = `
            <div class="menu-section">
                <h2 class="menu-section-title">${category}</h2>
        `;
        productsByCategory[category].forEach(product => {
            sectionHtml += `
                <a href="product.html?id=${product.id}" class="menu-item">
                    <div class="menu-item-details">
                        <h3>${product.name}</h3>
                        <p>${product.description.substring(0, 30)}...</p>
                    </div>
                    <div class="menu-item-price">
                        ${product.price ? `€${product.price.toFixed(2)}` : 'dès €' + product.options.size[0].price.toFixed(2)}
                    </div>
                </a>
            `;
        });
        sectionHtml += `</div>`;
        menuContainer.innerHTML += sectionHtml;
    }
}

// Affiche les détails d'un produit
function renderProductDetails() {
    const container = document.getElementById('product-detail-container');
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = products.find(p => p.id === productId);

    if (!product || !container) {
        container.innerHTML = "<p>Produit non trouvé.</p>";
        return;
    }

    let optionsHtml = '';
    if (product.options) {
        if (product.options.size) {
            optionsHtml += `<div class="product-options-group"><h4>Taille</h4><div class="options-container">`;
            product.options.size.forEach(s => {
                optionsHtml += `<button class="option-button size-option" data-price="${s.price}" data-name="${s.name}">${s.name}</button>`;
            });
            optionsHtml += `</div></div>`;
        }
        if (product.options.supplements) {
            optionsHtml += `<div class="product-options-group"><h4>En supplément</h4><div class="options-container vertical">`;
            product.options.supplements.forEach(sup => {
                optionsHtml += `<div class="supplement-item">
                    <input type="checkbox" id="${sup.name}" class="supplement-checkbox" data-price="${sup.price}" data-name="${sup.name}">
                    <label for="${sup.name}">${sup.name}</label>
                    <span>+€${sup.price.toFixed(2)}</span>
                </div>`;
            });
            optionsHtml += `</div></div>`;
        }
    }
    
    container.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h2 class="product-title">${product.name}</h2>
        <p class="product-description">${product.description}</p>
        ${optionsHtml}
        <button id="add-to-cart-btn" class="add-to-cart-button">Ajouter au panier</button>
    `;

    let selectedOptions = { size: null, supplements: [] };
    let basePrice = product.price || 0;
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    function updatePrice() {
        let currentPrice = basePrice;
        if (selectedOptions.size) {
            currentPrice = parseFloat(selectedOptions.size.price);
        }

        selectedOptions.supplements.forEach(sup => {
            currentPrice += parseFloat(sup.price);
        });

        addToCartBtn.textContent = `Ajouter au panier - €${currentPrice.toFixed(2)}`;
    }

    if(product.options && product.options.size) {
        const sizeButtons = container.querySelectorAll('.size-option');
        sizeButtons.forEach(button => {
            button.addEventListener('click', () => {
                sizeButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                selectedOptions.size = { name: button.dataset.name, price: button.dataset.price };
                updatePrice();
            });
        });
        // Select the first size by default
        if(sizeButtons.length > 0) {
            sizeButtons[0].click();
        }
    } else {
        updatePrice();
    }

    const supplementCheckboxes = container.querySelectorAll('.supplement-checkbox');
    supplementCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            if (checkbox.checked) {
                selectedOptions.supplements.push({ name: checkbox.dataset.name, price: checkbox.dataset.price });
            } else {
                selectedOptions.supplements = selectedOptions.supplements.filter(sup => sup.name !== checkbox.dataset.name);
            }
            updatePrice();
        });
    });

    addToCartBtn.addEventListener('click', () => {
        addToCart(product.id, 1, selectedOptions);
        // Optional: show a confirmation message
        alert('Produit ajouté au panier!');
    });
}

// Affiche la page du panier
function renderCartPage() {
    const itemsContainer = document.getElementById('cart-items-container');
    const summaryContainer = document.getElementById('cart-summary-container');
    const cart = getCart();

    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Votre panier est vide.</p>";
        return;
    }
    
    let itemsHtml = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if(product) {
            itemsHtml += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>${item.options.size ? item.options.size.name : ''}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-cart-item-id="${item.cartItemId}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-cart-item-id="${item.cartItemId}" data-change="1">+</button>
                </div>
            </div>`;
        }
    });
    itemsContainer.innerHTML = itemsHtml;

    const total = calculateTotal();
    summaryContainer.innerHTML = `
        <div class="cart-summary">
            <div class="summary-line">
                <span>Sous-total</span>
                <span>€${total.toFixed(2)}</span>
            </div>
            <div class="summary-line total">
                <span>Total</span>
                <span>€${total.toFixed(2)}</span>
            </div>
            <a href="confirmation.html" id="checkout-btn" class="checkout-button">Procéder au paiement</a>
        </div>
    `;

    document.getElementById('checkout-btn').addEventListener('click', (e) => {
        // e.preventDefault(); // enlever le commentaire si on ajoute une logique de paiement
        clearCart(); // On vide le panier après la commande
        // window.location.href = 'confirmation.html';
    });

    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cartItemId = button.dataset.cartItemId;
            const change = parseInt(button.dataset.change);
            const cart = getCart();
            const item = cart.find(i => i.cartItemId === cartItemId);
            if(item) {
                const newQuantity = item.quantity + change;
                if (newQuantity > 0) {
                    updateCartQuantity(cartItemId, newQuantity);
                } else {
                    // Remove item if quantity is 0 or less
                    updateCartQuantity(cartItemId, 0);
                }
                renderCartPage(); // Re-render the cart
            }
        });
    });
}

// Gère l'animation de la page de confirmation
function runConfirmationSequence() {
    const messages = [
        `Commande N°${Math.floor(Math.random() * 100) + 1}`,
        "Suivez les instructions sur le terminal pour finaliser votre commande.",
        "Merci ! Votre commande est en cours de préparation !"
    ];
    
    // Select only the first message element to display all messages sequentially
    const messageDisplayElement = document.querySelector('#confirmation-messages .message');
    const buttonElement = document.querySelector('.confirmation-button');
    let currentMessageIndex = 0;

    function showNextMessage() {
        if (currentMessageIndex < messages.length) {
            // Set the text content of the single display element
            messageDisplayElement.textContent = messages[currentMessageIndex];
            
            // Ensure it's visible
            messageDisplayElement.classList.add('active');
            
            currentMessageIndex++;
            setTimeout(showNextMessage, 3000); // Next message in 3 seconds
        } else {
             // Fin de la séquence, on affiche le bouton
             // Update with the final, longer message
             messageDisplayElement.textContent = "Merci ! Votre commande est en cours de préparation ! \n On s’occupe de tout, avec amour et caféine.";
             // Keep it active
             messageDisplayElement.classList.add('active');
             buttonElement.classList.add('visible');
        }
    }

    showNextMessage();
}