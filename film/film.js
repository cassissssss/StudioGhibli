// Variables globales
let films = [];
let currentIndex = 0;
const carouselRadius = 300; // Rayon du cercle ajusté

async function loadFilms() {
    try {
        const response = await fetch('../data/films.json');
        films = await response.json();
        
        // Générer les éléments du carousel
        createCarouselItems();
        
        // Charger les données du premier film
        updateFilmDisplay(0);
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
    }
}

function createCarouselItems() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';
    
    // Créer un élément pour chaque film
    films.forEach((film, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
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
    positionCarouselItems();
}

function positionCarouselItems() {
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const angleStep = (2 * Math.PI) / totalItems;
    const offsetX = -350;
    const offsetY = 80;

    
    
    items.forEach((item, index) => {
        // On décale les indices pour que l'élément actif soit toujours au centre droit
        // En utilisant le modulo pour faire un cycle circulaire
        const adjustedIndex = (index - currentIndex + totalItems) % totalItems;
        
        // Calculer la position sur le cercle - mettre le film actif à droite (angle 0)
        // et répartir les autres autour
        const angle = adjustedIndex * angleStep - Math.PI / 200; 
        
        // Coordonnées X et Y sur le cercle
        const x = Math.cos(angle) * carouselRadius + offsetX;
        const y = Math.sin(angle) * carouselRadius + offsetY;
        
        // Appliquer la transformation
        item.style.transform = `translate(${x}px, ${y}px)`;
        
        // Style visuel pour l'élément actif vs inactif
        const isActive = index === currentIndex;
        
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
    if (index === currentIndex) return;
    
    // Animation pour la transition
    const items = document.querySelectorAll('.carousel-item');
    items.forEach(item => {
        item.style.transition = 'all 0.8s ease';
    });
    
    // Mettre à jour l'index courant
    currentIndex = index;
    
    // Repositionner les éléments
    positionCarouselItems();
    
    // Mettre à jour l'affichage du film
    updateFilmDisplay(index);
}

function updateFilmDisplay(index) {
    const film = films[index];
    
    // Ajouter la classe fade-in pour l'animation
    const filmCard = document.querySelector('.film-card');
    filmCard.classList.remove('fade-in');
    void filmCard.offsetWidth; // Force reflow
    filmCard.classList.add('fade-in');
    
    // Mettre à jour les éléments
    document.querySelector('.main-image').src = film.image || 'placeholder.jpg';
    document.querySelector('.main-image').alt = film.name;
    
    // Gérer le saut de ligne dans le titre
    const title = film.name;
    document.querySelector('.film-info h1').textContent = title;
    
    document.querySelector('.description').textContent = film.description || 'Description non disponible.';
    document.querySelector('.year').textContent = film.year;
    document.querySelector('.japanese-title').textContent = film.japanese_title || '';
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', loadFilms);