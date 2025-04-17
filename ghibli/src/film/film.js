import { setupFilmPopup } from "./popup";   

let films = [];
let filmCurrentIndex = 0;
const filmCarouselRadius = 300;

// Charge les données des films depuis le JSON
async function loadFilms() {
    try {
        const response = await fetch('data-json/films.json');
        films = await response.json();
        
        createFilmCarouselItems();
        updateFilmDisplay(0);
        initScrollRotation();
        // Ne plus appeler addScrollToggle();
        setupFilmPopup(films, () => filmCurrentIndex);
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
    }
}

// Crée les éléments du carrousel
function createFilmCarouselItems() {
    const carousel = document.getElementById('film-carousel');
    carousel.innerHTML = '';
    
    films.forEach((film, index) => {
        const item = document.createElement('div');
        item.className = `film-item ${index === 0 ? 'active' : ''}`;
        item.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = film.image || 'placeholder.jpg';
        img.alt = film.name;
        
        item.appendChild(img);
        carousel.appendChild(item);
        item.addEventListener('click', () => selectFilm(index));
    });
    
    positionFilmCarouselItems();
}

// Positionne les films en cercle
function positionFilmCarouselItems() {
    const items = document.querySelectorAll('.film-item');
    const totalItems = items.length;
    const angleStep = (2 * Math.PI) / totalItems;
    const offsetX = -350;
    const offsetY = 80;
    
    items.forEach((item, index) => {
        const adjustedIndex = (index - filmCurrentIndex + totalItems) % totalItems;
        const angle = adjustedIndex * angleStep - Math.PI / 200; 
        const x = Math.cos(angle) * filmCarouselRadius + offsetX;
        const y = Math.sin(angle) * filmCarouselRadius + offsetY;
        
        item.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        
        const isActive = index === filmCurrentIndex;
        
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
            item.style.zIndex = adjustedIndex;
            item.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        }
    });
}

// Sélectionne un nouveau film et met à jour l'affichage
function selectFilm(index) {
    if (index === filmCurrentIndex) return;
    
    filmCurrentIndex = index;
    positionFilmCarouselItems();
    updateFilmDisplay(index);
}

// Met à jour l'affichage des informations du film
function updateFilmDisplay(index) {
    const film = films[index];
    
    const filmCard = document.querySelector('.film-card');
    filmCard.classList.remove('film-fade-in');
    void filmCard.offsetWidth; 
    filmCard.classList.add('film-fade-in');
    
    document.querySelector('.film-main-image').src = film.image || 'placeholder.jpg';
    document.querySelector('.film-main-image').alt = film.name;
    document.querySelector('.film-info h1').textContent = film.name;
    document.querySelector('.film-description').textContent = film.description || 'Description non disponible.';
    document.querySelector('.film-year').textContent = film.year;
    document.querySelector('.film-japanese-title').textContent = film.japanese_title || '';
}

// Initialise la rotation par défilement
function initScrollRotation() {
    let isScrolling = false;
    let wheelEvents = 0;
    let filmsViewed = 0;
    let hasCompletedRotation = false;
    let scrollTimeout = null;
    let lastScrollTime = 0;
    let scrollDebounceTime = 100; // Temps en ms pour considérer une nouvelle série de scrolls

    function handleScroll(event) {
        const currentTime = Date.now();
        const scrollDirection = event.deltaY > 0 ? 1 : -1;
        
        // Réinitialiser le compteur si le scroll est trop rapide ou si on change de direction
        if (currentTime - lastScrollTime > scrollDebounceTime) {
            wheelEvents = 0;
        }
        lastScrollTime = currentTime;
        
        // Si on a déjà vu tous les films, passer à la section suivante
        if (hasCompletedRotation) {
            // Vérifier si c'est un nouveau geste de scroll (pas une continuation rapide)
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                const nextSection = document.querySelector('.anecdotes-container') || 
                                   document.querySelector('#anecdotes-section');
                
                if (nextSection) {
                    event.preventDefault();
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300); // Attendre un peu pour s'assurer que c'est intentionnel
            
            return;
        }
        
        if (isScrolling) {
            wheelEvents += scrollDirection;
            return;
        }
        
        isScrolling = true;
        
        const newIndex = (filmCurrentIndex + scrollDirection + films.length) % films.length;
        selectFilm(newIndex);
        
        // Compter le nombre de films vus avec une meilleure logique
        if (scrollDirection > 0) {
            filmsViewed++;
            // Éviter de compter plusieurs fois le même film lors de scrolls rapides
            if (filmsViewed > films.length) {
                filmsViewed = films.length;
            }
        } else {
            // Si on revient en arrière, décrémenter le compteur mais pas en dessous de 0
            filmsViewed = Math.max(0, filmsViewed - 1);
        }
        
        // Vérifier si on a fait un tour complet et attendre un peu avant de confirmer
        if (filmsViewed >= films.length) {
            // Attendre un peu pour s'assurer que l'utilisateur a bien fini son exploration
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                hasCompletedRotation = true;
            }, 800); // Un délai raisonnable pour confirmer la fin du tour
        }
        
        setTimeout(() => {
            isScrolling = false;
            
            if (wheelEvents !== 0) {
                const nextDirection = wheelEvents > 0 ? 1 : -1;
                wheelEvents = 0;
                
                setTimeout(() => {
                    const nextEvent = new WheelEvent('wheel', { deltaY: nextDirection * 100 });
                    handleScroll(nextEvent);
                }, 100);
            }
        }, 800);
    }
    
    const filmContainer = document.querySelector('.film-container');
    if (filmContainer) {
        // Toujours activer la rotation par défaut (sans le besoin d'un bouton)
        filmContainer.classList.add('scroll-rotation-active');
        
        filmContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            handleScroll(e);
        }, { passive: false });
    }
}

document.addEventListener('DOMContentLoaded', loadFilms);