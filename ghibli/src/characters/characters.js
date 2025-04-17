let characters = [];
let currentIndex = 0;
let isScrolling = false;
let interactionCount = 0;

// Récupération des personnages
const fetchCharacters = async () => {
    try {
        const response = await fetch("data-json/characters.json");
        const data = await response.json();
        characters = data.characters;
        initCarousel();
    } catch (error) {
        console.error("Erreur lors de la récupération des personnages:", error);
    }
};

// Configuration de la zone de capture de défilement
const setupScrollZone = () => {
    const container = document.getElementById('carousel-container');
    
    // Créer une zone visuelle qui indique quand le scroll est capturé
    const scrollZone = document.createElement('div');
    scrollZone.className = 'scroll-capture-zone';
    container.appendChild(scrollZone);
    
    // Observer quand le carousel entre dans le viewport
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                container.classList.add('active-scroll-capture');
                scrollZone.classList.add('visible');
            } else {
                container.classList.remove('active-scroll-capture');
                scrollZone.classList.remove('visible');
            }
        });
    }, { threshold: 0.3 });
    
    carouselObserver.observe(container);
};

// Initialisation du carousel
const initCarousel = () => {
    const container = document.getElementById("carousel-container");
    const wrapper = document.createElement("div");
    wrapper.className = "carousel-wrapper";

    // Créer les éléments du carousel
    for (let i = 0; i < 5; i++) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "carousel-item";
        itemDiv.id = `item-${i}`;
        itemDiv.innerHTML = '<img src="" alt="">';

        itemDiv.addEventListener("click", () => {
            const offset = i - 2;
            if (offset !== 0) {
                currentIndex = (currentIndex + offset + characters.length) % characters.length;
                updateCarousel();
                hideIndicatorAfterInteractions();
            }
        });

        wrapper.appendChild(itemDiv);
    }

    // Créer la div d'information
    const infoDiv = document.createElement("div");
    infoDiv.className = "character-info";
    infoDiv.innerHTML = '<h4></h4><p></p>';

    // Ajouter tous les éléments au conteneur
    container.appendChild(wrapper);
    container.appendChild(infoDiv);

    // Configurer la zone de capture de défilement
    setupScrollZone();
    
    // Ajouter l'indicateur de swipe
    addCharacterSwipeIndicator(container);

    // Gérer le comportement de drag et swipe
    let startX = 0;
    wrapper.addEventListener("mousedown", (e) => startX = e.clientX);
    wrapper.addEventListener("mouseup", (e) => handleSwipe(startX, e.clientX));
    wrapper.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, { passive: true });
    wrapper.addEventListener("touchend", (e) => handleSwipe(startX, e.changedTouches[0].clientX));

    // Initialiser l'affichage du carousel
    updateCarousel();
};

// Gestion du swipe horizontal
const handleSwipe = (start, end) => {
    const diff = start - end;
    if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        hideIndicatorAfterInteractions();
    }
};

// Gestion du défilement vertical pour une navigation horizontale
const throttleScroll = (e) => {
    const container = document.getElementById('carousel-container');
    const rect = container.getBoundingClientRect();
    
    // Vérifier si l'utilisateur est directement sur le carousel
    const isDirectlyOnCarousel = 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom && 
        e.clientX >= rect.left && 
        e.clientX <= rect.right;
    
    if (isDirectlyOnCarousel) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const delta = e.deltaY;
        if (Math.abs(delta) < 30) return;
        
        isScrolling = true;
        delta > 0 ? nextSlide() : prevSlide();
        
        setTimeout(() => {
            isScrolling = false;
        }, 500);
        
        hideIndicatorAfterInteractions();
    }
};

// Faire disparaître l'indicateur après quelques interactions
const hideIndicatorAfterInteractions = () => {
    interactionCount++;
    if (interactionCount >= 3) {
        const indicator = document.querySelector('.character-swipe-indicator');
        if (indicator) {
            indicator.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                if (indicator && indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 500);
        }
    }
};

// Mettre à jour l'affichage du carousel
const updateCarousel = () => {
    const positions = ["left-2", "left-1", "center", "right-1", "right-2"];
    const infoTitle = document.querySelector(".character-info h4");
    const infoText = document.querySelector(".character-info p");

    for (let i = 0; i < 5; i++) {
        const itemIndex = (currentIndex - 2 + i + characters.length) % characters.length;
        const character = characters[itemIndex];
        const itemElement = document.getElementById(`item-${i}`);

        itemElement.className = `carousel-item ${positions[i]}`;

        const img = itemElement.querySelector("img");
        img.src = character.image;
        img.alt = character.name;
    }

    const centerCharacter = characters[currentIndex];
    infoTitle.textContent = centerCharacter.name;
    infoText.textContent = centerCharacter.film;
    
    // Animation supplémentaire pour la transition
    const centerItem = document.querySelector(".carousel-item.center");
    centerItem.classList.add('focus-animation');
    setTimeout(() => centerItem.classList.remove('focus-animation'), 500);
};

// Navigation dans le carousel
const nextSlide = () => {
    currentIndex = (currentIndex + 1) % characters.length;
    updateCarousel();
};

const prevSlide = () => {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
    updateCarousel();
};

// Fonction pour ajouter l'indicateur de swipe
function addCharacterSwipeIndicator(container) {
    // Créer l'indicateur
    const indicator = document.createElement('div');
    indicator.className = 'character-swipe-indicator';
    
    indicator.innerHTML = `
        <div class="indicator-background"></div>
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
        <div class="swipe-text">scrollez pour faire défiler les personnages</div>
    `;
    
    // Ajouter les styles
    const style = document.createElement('style');
    style.textContent = `
        .character-swipe-indicator {
            position: absolute;
            left: 50.02%;
            top: 38.7%;  /* Centré verticalement */
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
        
        .character-swipe-indicator .indicator-background {
            position: absolute;
            width: 250px;
            height: 250px;
            background-color: rgba(0, 0, 0, 0.5);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 20px;
            z-index: -1;
        }
        
        .character-swipe-indicator .mouse-container {
            position: relative;
            height: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: mouseMove 2s ease-in-out infinite;
        }
        
        .character-swipe-indicator .mouse {
            width: 40px;
            height: 70px;
            border: 3px solid white;
            border-radius: 20px;
            position: relative;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        
        .character-swipe-indicator .mouse-wheel {
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
        
        .character-swipe-indicator .scroll-arrows {
            position: absolute;
            left: auto;
            right: -15px;
            top: 50%;
            transform: translateY(-50%);
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
        }
        
        .character-swipe-indicator .arrow {
            font-size: 14px;
            opacity: 0.8;
            filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
            position: relative;
            margin: 5px 0;
        }
        
        .character-swipe-indicator .arrow-up {
            animation: arrowBlink 1.5s ease-in-out infinite;
            animation-delay: 0s;
        }
        
        .character-swipe-indicator .arrow-down {
            animation: arrowBlink 1.5s ease-in-out infinite;
            animation-delay: 0.75s;
        }
        
        .character-swipe-indicator .swipe-text {
            font-weight: 500;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            margin-top: 15px;
            font-size: 20px;
        }
    `;
    
    document.head.appendChild(style);
    container.appendChild(indicator);
    
    // Supprimer après interaction
    container.addEventListener('wheel', () => {
        hideIndicatorAfterInteractions();
    });
    
    container.addEventListener('click', () => {
        hideIndicatorAfterInteractions();
    });
    
    // Masquer après un délai
    setTimeout(() => {
        const indicator = document.querySelector('.character-swipe-indicator');
        if (indicator && indicator.parentNode) {
            indicator.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                if (indicator && indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 500);
        }
    }, 10000);
}

// Setup et démarrage
const setupSectionObserver = () => {
    const charactersSection = document.getElementById('characters-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                isScrolling = false;
            }
        });
    }, { threshold: 0.1 });
    
    if (charactersSection) {
        sectionObserver.observe(charactersSection);
    }
};

// Ajouter l'écouteur d'événement pour le défilement
document.addEventListener("wheel", throttleScroll, { passive: false });

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();
    setupSectionObserver();
});