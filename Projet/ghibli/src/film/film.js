import { setupFilmPopup } from "./popup";   

let films = [];
let filmCurrentIndex = 0;
const filmCarouselRadius = 300;

// Charge les données des films depuis le JSON
async function loadFilms() {
    try {
        const response = await fetch('films.json');
        films = await response.json();
        
        createFilmCarouselItems();
        updateFilmDisplay(0);
        initScrollRotation();
        addScrollToggle();
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

    function handleScroll(event) {
        const scrollDirection = event.deltaY > 0 ? 1 : -1;
        
        if (isScrolling) {
            wheelEvents += scrollDirection;
            return;
        }
        
        isScrolling = true;
        
        const newIndex = (filmCurrentIndex + scrollDirection + films.length) % films.length;
        selectFilm(newIndex);
        
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
        filmContainer.addEventListener('wheel', (e) => {
            if (filmContainer.classList.contains('scroll-rotation-active')) {
                e.preventDefault();
                handleScroll(e);
            }
        }, { passive: false });
    }
}

// Ajoute le bouton pour activer/désactiver la rotation au scroll
function addScrollToggle() {
    const filmSection = document.querySelector('.film-container');
    
    // Créer un bouton de toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'scroll-toggle-btn';
    toggleBtn.innerHTML = '🔄 Scroll rotation: OFF';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.top = '20px';
    toggleBtn.style.right = '20px';
    toggleBtn.style.zIndex = '1000';
    toggleBtn.style.padding = '8px 16px';
    toggleBtn.style.background = 'rgba(255, 255, 255, 0.7)';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '20px';
    toggleBtn.style.cursor = 'pointer';
    
    let scrollActive = false;
    
    toggleBtn.addEventListener('click', () => {
        scrollActive = !scrollActive;
        toggleBtn.innerHTML = scrollActive 
            ? '🔄 Scroll rotation: ON' 
            : '🔄 Scroll rotation: OFF';
            
        if (scrollActive) {
            filmSection.classList.add('scroll-rotation-active');
        } else {
            filmSection.classList.remove('scroll-rotation-active');
        }
    });
    
    filmSection.appendChild(toggleBtn);
}

document.addEventListener('DOMContentLoaded', loadFilms);