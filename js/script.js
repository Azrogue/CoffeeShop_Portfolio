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
                optionsHtml += `<button class="option-button size-option" data-price="${s.price}">${s.name}</button>`;
            });
            optionsHtml += `</div></div>`;
        }
        if (product.options.supplements) {
            optionsHtml += `<div class="product-options-group"><h4>En supplément</h4><div class="options-container vertical">`;
            product.options.supplements.forEach(sup => {
                optionsHtml += `<div class="supplement-item">
                    <input type="checkbox" id="${sup.name}" class="supplement-checkbox" data-price="${sup.price}">
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
    
    // Logique pour la sélection d'options et le calcul du prix
    // ... (à ajouter pour plus d'interactivité)
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
                    <p>${item.options.size || ''}</p>
                </div>
                <div class="cart-item-quantity">
                    <button>-</button>
                    <span>${item.quantity}</span>
                    <button>+</button>
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
}

// Gère l'animation de la page de confirmation
function runConfirmationSequence() {
    const messages = [
        `Commande N°${Math.floor(Math.random() * 100) + 1}`,
        "Suivez les instructions sur le terminal pour finaliser votre commande.",
        "Merci ! Votre commande est en cours de préparation !"
    ];
    
    const messageElements = document.querySelectorAll('#confirmation-messages .message');
    const buttonElement = document.querySelector('.confirmation-button');
    let currentMessageIndex = 0;

    function showNextMessage() {
        if (currentMessageIndex < messages.length) {
            // Cacher l'ancien message
            if (currentMessageIndex > 0) {
                messageElements[currentMessageIndex - 1].classList.remove('active');
            }
            
            // Afficher le nouveau
            messageElements[currentMessageIndex].textContent = messages[currentMessageIndex];
            messageElements[currentMessageIndex].classList.add('active');
            
            currentMessageIndex++;
            setTimeout(showNextMessage, 3000); // Prochain message dans 3 secondes
        } else {
             // Fin de la séquence, on affiche le bouton
             messageElements[currentMessageIndex - 1].classList.remove('active'); // cacher le dernier message textuel
             messageElements[2].textContent = "Merci ! Votre commande est en cours de préparation ! \n On s’occupe de tout, avec amour et caféine.";
             messageElements[2].classList.add('active'); // réafficher le message final
             buttonElement.classList.add('visible');
        }
    }

    showNextMessage();
}