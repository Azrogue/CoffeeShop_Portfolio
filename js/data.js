const products = [
    {
        id: "iced-latte",
        name: "Iced Latte",
        category: "Latte",
        description: "Un café espresso classique avec du lait à température ambiante. Onctueux, crémeux et frais !",
        image: "assets/images/iced-latte.jpg",
        options: {
            size: [
                { name: "Petit", price: 3.50 },
                { name: "Moyen", price: 4.50 },
                { name: "Large", price: 5.50 }
            ],
            supplements: [
                { name: "Extra Shot", price: 1.00 },
                { name: "Sirop de Vanille", price: 0.50 },
                { name: "Lait végétal", price: 0.50 }
            ]
        }
    },
    {
        id: "muffin",
        name: "Muffin",
        category: "Viennoiseries",
        description: "Un muffin tout choco, moelleux à l'intérieur, crousti sur le dessus. Juste ce qu'il faut pour se faire plaisir.",
        image: "assets/images/muffin.jpg",
        price: 3.50, // Prix unique pour cet article
        options: null // Pas d'options pour le muffin
    },
    {
        id: "espresso",
        name: "Espresso",
        category: "Café",
        description: "Un shot intense et aromatique.",
        price: 2.50,
        options: null
    },
    {
        id: "croissant",
        name: "Croissant",
        category: "Viennoiseries",
        description: "Un classique du petit-déjeuner français.",
        price: 2.50,
        options: null
    }
    // ... Ajoute tous tes autres produits ici !
];

const menuSections = ["Café", "Latte", "Thé", "Jus Frais", "Viennoiseries", "Brunchs"];