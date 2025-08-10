// Attend que le contenu de la page soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {

    // Vérifie si nous sommes sur la page de chargement (splash screen)
    // en cherchant un élément unique à cette page.
    const splashScreen = document.querySelector('.splash-screen');

    if (splashScreen) {
        // Définit un minuteur pour rediriger après 3 secondes (3000 millisecondes)
        setTimeout(() => {
            // Redirige l'utilisateur vers la page d'accueil
            window.location.href = 'home.html';
        }, 3000); // 3 secondes
    }

});