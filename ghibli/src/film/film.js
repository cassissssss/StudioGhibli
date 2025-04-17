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
    let autoRotationInterval = null;
    let autoRotationSpeed = 5000; // Temps en ms entre chaque rotation automatique
    
    // Indicateur pour savoir si la démonstration initiale a été faite
    let initialDemoDone = false;

    function handleScroll(event) {
        // Si autoRotation est en cours, l'arrêter car l'utilisateur interagit manuellement
        stopAutoRotation();
        stopInitialDemo(); // Arrêter aussi la démo initiale si elle est en cours
        
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
    
    // Variables pour la démo initiale
    let initialDemoInterval = null;
    
    // Fonction pour démarrer la rotation automatique
    function startAutoRotation() {
        if (autoRotationInterval) return; // Éviter les doubles intervalles
        
        autoRotationInterval = setInterval(() => {
            if (!isScrolling) {
                const nextIndex = (filmCurrentIndex + 1) % films.length;
                selectFilm(nextIndex);
            }
        }, autoRotationSpeed);
    }
    
    // Fonction pour arrêter la rotation automatique
    function stopAutoRotation() {
        if (autoRotationInterval) {
            clearInterval(autoRotationInterval);
            autoRotationInterval = null;
        }
    }
    
    // Fonction pour démarrer la démonstration initiale immédiate
    function startInitialDemo() {
        if (initialDemoInterval || initialDemoDone) return; // Ne pas démarrer si déjà en cours ou déjà faite
        initialDemoDone = true;
        
        let demoCount = 0;
        const demoSpeed = 1200; // Rotation plus rapide pour la démo (1.2 secondes par film)
        
        // Démarrer immédiatement
        initialDemoInterval = setInterval(() => {
            if (demoCount >= Math.min(3, films.length)) {
                // Arrêter après avoir montré 3 films ou tous les films si moins de 3
                stopInitialDemo();
                return;
            }
            
            const nextIndex = (filmCurrentIndex + 1) % films.length;
            selectFilm(nextIndex);
            demoCount++;
        }, demoSpeed);
    }
    
    // Fonction pour arrêter la démo initiale
    function stopInitialDemo() {
        if (initialDemoInterval) {
            clearInterval(initialDemoInterval);
            initialDemoInterval = null;
        }
    }
    
    const filmContainer = document.querySelector('.film-container');
    if (filmContainer) {
        filmContainer.classList.add('scroll-rotation-active');
        
        // Ajouter l'indicateur de swipe
        addSwipeIndicator(filmContainer);
        
        filmContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            handleScroll(e);
        }, { passive: false });
        
        // Démarrer l'autorotation au survol
        filmContainer.addEventListener('mouseenter', () => {
            // Ne pas démarrer l'auto-rotation si la démo initiale est en cours
            if (!initialDemoInterval) {
                startAutoRotation();
            }
        });
        
        // Arrêter l'autorotation quand la souris quitte la zone
        filmContainer.addEventListener('mouseleave', stopAutoRotation);
        
        // Démarrer la démonstration initiale immédiatement
        // Avec un léger délai pour permettre au DOM de se stabiliser
        setTimeout(startInitialDemo, 500);
        
        // Arrêter la démo initiale si l'utilisateur clique
        filmContainer.addEventListener('click', stopInitialDemo);
    }
}

function addSwipeIndicator(container) {
    // Créer l'élément indicateur
    const indicator = document.createElement('div');
    indicator.className = 'swipe-indicator';
    
    // Ajouter le contenu HTML avec icônes et texte
    indicator.innerHTML = `
        <div class="swipe-animation">
            <svg class="swipe-arrow left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#fff" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
            </svg>
            <svg class="mouse-wheel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
                <path fill="#fff" d="M12,3C8.59,3 6,5.61 6,9v6c0,3.39 2.61,6 6,6c3.39,0 6,-2.61 6,-6V9C18,5.61 15.39,3 12,3zM12,5c2.21,0 4,1.79 4,4v6c0,2.21 -1.79,4 -4,4c-2.21,0 -4,-1.79 -4,-4V9C8,6.79 9.79,5 12,5zM12,9c-0.55,0 -1,0.45 -1,1v2c0,0.55 0.45,1 1,1c0.55,0 1,-0.45 1,-1v-2C13,9.45 12.55,9 12,9z"/>
            </svg>
            <svg class="swipe-arrow right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#fff" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
            </svg>
        </div>
        <div class="swipe-text">Faites défiler pour explorer les films</div>
    `;
    
    // Styles CSS injectés directement
    const style = document.createElement('style');
    style.textContent = `
        .swipe-indicator {
            position: absolute;
            left: -150px;  /* Modifié de -220px à -150px pour déplacer vers la droite */
            top: 50%;
            transform: translateY(-50%);
            background-color: #ca9ea9;
            padding: 15px;
            border-radius: 10px;
            color: white;
            font-size: 14px;
            text-align: center;
            max-width: 160px;
            animation: fadeInOut 2s ease-in-out infinite;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .swipe-animation {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }
        
        .swipe-arrow {
            animation: moveArrow 2s ease-in-out infinite;
        }
        
        .swipe-arrow.left {
            animation-delay: 0s;
        }
        
        .swipe-arrow.right {
            animation-delay: 1s;
        }
        
        .mouse-wheel {
            margin: 0 5px;
        }
        
        .swipe-text {
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        @keyframes moveArrow {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px); }
            75% { transform: translateX(3px); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @media (max-width: 768px) {
            .swipe-indicator {
                left: 10px;
                bottom: 20px;
                top: auto;
                transform: none;
                background-color: #ca9ea9;
            }
        }
    `;
    
    // Ajouter les styles au document
    document.head.appendChild(style);
    
    // Ajouter l'indicateur au conteneur
    container.appendChild(indicator);
    
    // Faire disparaître l'indicateur après une interaction
    const hideIndicatorAfterInteraction = () => {
        const indicator = document.querySelector('.swipe-indicator');
        if (indicator) {
            indicator.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                if (indicator && indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 500);
        }
        
        // Supprimer les écouteurs après utilisation
        container.removeEventListener('wheel', hideIndicatorAfterInteraction);
        container.removeEventListener('click', hideIndicatorAfterInteraction);
    };
    
    // Masquer l'indicateur après la première interaction
    container.addEventListener('wheel', hideIndicatorAfterInteraction);
    container.addEventListener('click', hideIndicatorAfterInteraction);
    
    // Masquer l'indicateur après un délai (10 secondes)
    setTimeout(() => {
        hideIndicatorAfterInteraction();
    }, 10000);
}

// Modification de l'écouteur DOMContentLoaded pour appeler la nouvelle fonction
document.addEventListener('DOMContentLoaded', () => {
    loadFilms();
    addNavigationButtons();
});