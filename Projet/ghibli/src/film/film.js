import { setupFilmPopup }  from "./popup";   

let films = [];
let filmCurrentIndex = 0; // Renommé pour être cohérent
const filmCarouselRadius = 300; // Rayon du cercle ajusté

async function loadFilms() {
    try {
        const response = await fetch('films.json');
        films = await response.json();
        
        // Générer les éléments du carousel
        createFilmCarouselItems();
        
        // Charger les données du premier film
        updateFilmDisplay(0);

        setupFilmPopup(films, () => filmCurrentIndex);
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
    }
}

function createFilmCarouselItems() {
    const carousel = document.getElementById('film-carousel');
    carousel.innerHTML = '';
    
    // Créer un élément pour chaque film
    films.forEach((film, index) => {
        const item = document.createElement('div');
        item.className = `film-item ${index === 0 ? 'active' : ''}`;
        item.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = film.image || 'placeholder.jpg';
        img.alt = film.name;
        
        item.appendChild(img);
        carousel.appendChild(item);
        
        // Ajouter l'événement de clic
        item.addEventListener('click', () => selectFilm(index));
    });
    
    // Positionner les items en cercle
    positionFilmCarouselItems();
}

function positionFilmCarouselItems() {
    const items = document.querySelectorAll('.film-item');
    const totalItems = items.length;
    const angleStep = (2 * Math.PI) / totalItems;
    const offsetX = -350;
    const offsetY = 80;
    
    items.forEach((item, index) => {
        // On décale les indices pour que l'élément actif soit toujours au centre droit
        // En utilisant le modulo pour faire un cycle circulaire
        const adjustedIndex = (index - filmCurrentIndex + totalItems) % totalItems;
        
        // Calculer la position sur le cercle - mettre le film actif à droite (angle 0)
        // et répartir les autres autour
        const angle = adjustedIndex * angleStep - Math.PI / 200; 
        
        // Coordonnées X et Y sur le cercle
        const x = Math.cos(angle) * filmCarouselRadius + offsetX;
        const y = Math.sin(angle) * filmCarouselRadius + offsetY;
        
        // Appliquer la transformation
        item.style.transform = `translate(${x}px, ${y}px)`;
        
        // Style visuel pour l'élément actif vs inactif
        const isActive = index === filmCurrentIndex;
        
        // Transition plus complexe pour effet visuel
        item.style.transition = 'all 0.8s ease';
        
        if (isActive) {
            item.classList.add('active');
            item.style.opacity = 1;
            item.style.filter = 'grayscale(0%)'; 
            item.style.zIndex = 100;
            item.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
        } else {
            item.classList.remove('active');
            item.style.opacity = 0.7;
            item.style.filter = 'grayscale(100%)';
            item.style.zIndex = 10;
        }
    });
}

function selectFilm(index) {
    if (index === filmCurrentIndex) return;
    
    // Animation pour la transition
    const items = document.querySelectorAll('.film-item');
    items.forEach(item => {
        item.style.transition = 'all 0.8s ease';
    });
    
    // Mettre à jour l'index courant
    filmCurrentIndex = index;
    
    // Repositionner les éléments
    positionFilmCarouselItems();
    
    // Mettre à jour l'affichage du film
    updateFilmDisplay(index);
}

function updateFilmDisplay(index) {
    const film = films[index];
    
    // Ajouter la classe fade-in pour l'animation
    const filmCard = document.querySelector('.film-card');
    filmCard.classList.remove('film-fade-in');
    void filmCard.offsetWidth; // Force reflow
    filmCard.classList.add('film-fade-in');
    
    // Mettre à jour les éléments
    document.querySelector('.film-main-image').src = film.image || 'placeholder.jpg';
    document.querySelector('.film-main-image').alt = film.name;
    
    // Gérer le saut de ligne dans le titre
    const title = film.name;
    document.querySelector('.film-info h1').textContent = title;
    
    document.querySelector('.film-description').textContent = film.description || 'Description non disponible.';
    document.querySelector('.film-year').textContent = film.year;
    document.querySelector('.film-japanese-title').textContent = film.japanese_title || '';
}

// Configuration du popup
function setupPopup() {
    const popup = document.getElementById('popup-overlay');
    const popupBody = document.querySelector('.popup-body');
    const closeBtn = document.querySelector('.close-popup');
    const exploreBtn = document.querySelector('.film-explore');
    
    // Ouvrir le popup au clic sur le bouton Explorer
    exploreBtn.addEventListener('click', () => {
        // CORRECTION ICI: utiliser filmCurrentIndex au lieu de currentIndex
        const film = films[filmCurrentIndex];
        popup.classList.add('popup-show');
        
    });
    
    // Fermer le popup au clic sur le bouton de fermeture
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('popup-show');
    });
    
    // Fermer le popup en cliquant en dehors du contenu
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('popup-show');
        }
    });
    
    // Fermer le popup avec la touche Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('popup-show')) {
            popup.classList.remove('popup-show');
        }
    });
}

// Fonction pour créer la grille de personnages en fonction du film
function createCharacterGrid(filmName) {
    // Cette fonction devra être implémentée pour afficher les personnages du film
    // Pour l'instant, on retourne une version simple
    return `
        <div class="character-grid">
            <p>Personnages du film "${filmName}" (à implémenter)</p>
        </div>
    `;
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    loadFilms();
});