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
    
    // Ajouter le contenu HTML avec l'icône de souris et les flèches
    indicator.innerHTML = `
        <div class="swipe-animation">
            <div class="mouse-container">
                <div class="mouse">
                    <div class="mouse-wheel"></div>
                    <div class="scroll-arrows">
                        <div class="arrow arrow-up">▲</div>
                        <div class="arrow arrow-down">▼</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="swipe-text">Défilez pour explorer les films</div>
    `;
    
    // Styles CSS injectés directement
    const style = document.createElement('style');
    style.textContent = `
        .swipe-indicator {
            position: absolute;
            left: 30%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: transparent;
            padding: 15px;
            color: white;
            font-size: 18px;
            text-align: center;
            max-width: 200px;
            z-index: 90;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }
        
        .mouse-container {
            position: relative;
            height: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: mouseMove 2s ease-in-out infinite;
        }
        
        .mouse {
            width: 40px;
            height: 70px;
            border: 3px solid white;
            border-radius: 20px;
            position: relative;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        
        .mouse-wheel {
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            animation: scrollWheel 1.5s ease-in-out infinite;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        .scroll-arrows {
        position: absolute;
        left: auto;  /* Suppression du positionnement à gauche */
        right: -25px;  /* Positionnement à droite */
        top: 50%;  /* Centrage vertical */
        transform: translateY(-50%);  /* Parfait centrage vertical */
        height: 70px;  /* Hauteur ajustée */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    
    .arrow {
        font-size: 14px;
        opacity: 0.8;
        filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
        position: relative;  /* Position relative au lieu d'absolute */
        margin: 5px 0;  /* Marge pour séparer les flèches */
    }
    
    .arrow-up {
        /* Suppression de position: absolute et top: 0 */
        animation: arrowBlink 1.5s ease-in-out infinite;
        animation-delay: 0s;
    }
    
    .arrow-down {
        /* Suppression de position: absolute et bottom: 0 */
        animation: arrowBlink 1.5s ease-in-out infinite;
        animation-delay: 0.75s;
    }
        
        .swipe-text {
            font-weight: 500;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            margin-top: 15px;
            font-size: 20px;
        }
        
        @keyframes scrollWheel {
            0% { top: 15px; }
            50% { top: 45px; }
            100% { top: 15px; }
        }
        
        @keyframes mouseMove {
            0%, 100% { transform: translateY(-8px); }
            50% { transform: translateY(8px); }
        }
        
        @keyframes arrowBlink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @media (max-width: 768px) {
            .swipe-indicator {
                bottom: 30px;
                top: auto;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
            }
            
            .mouse {
                width: 35px;
                height: 60px;
            }
            
            .swipe-text {
                font-size: 16px;
            }
        }
    `;
    
    // Ajouter les styles au document
    document.head.appendChild(style);
    
    // Ajouter l'indicateur au conteneur
    container.appendChild(indicator);
    
    // Le reste du code reste inchangé
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