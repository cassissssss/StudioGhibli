// Variables globales
let films = [];
let currentIndex = 0;
const carouselRadius = 230; // Rayon du cercle

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
    
    items.forEach((item, index) => {
        // Calculer la position sur le cercle
        // Rotation décalée pour que le premier élément soit à environ 10 heures
        const angle = (index * angleStep) - Math.PI / 20;
        
        // Coordonnées X et Y sur le cercle
        const x = Math.cos(angle) * carouselRadius;
        const y = Math.sin(angle) * carouselRadius;
        
        // Appliquer la transformation - translation uniquement, pas de rotation 3D
        item.style.transform = `translate(${x}px, ${y}px)`;
        
        // Ajuster la taille et l'opacité
        const isActive = index === currentIndex;
        item.style.opacity = isActive ? 1 : 0.7;
        item.style.zIndex = isActive ? 100 : 10;
        
        // Gérer l'état actif
        if (isActive) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function selectFilm(index) {
    if (index === currentIndex) return;
    
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
    
    // Gérer le saut de ligne dans le titre (insérer <br> après un espace au milieu)
    const title = film.name;
    const words = title.split(' ');
    const middleIndex = Math.ceil(words.length / 2);
    const firstPart = words.slice(0, middleIndex).join(' ');
    const secondPart = words.slice(middleIndex).join(' ');
    document.querySelector('.film-info h1').innerHTML = `${firstPart}<br>${secondPart}`;
    
    document.querySelector('.description').textContent = film.description || 'Description non disponible.';
    document.querySelector('.year').textContent = film.year;
    document.querySelector('.japanese-title').textContent = film.japanese_title || '';
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', loadFilms);