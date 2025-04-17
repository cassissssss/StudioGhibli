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

 // Modifier le HTML de l'indicateur dans initCarousel() :

const scrollIndicator = document.createElement("div");
scrollIndicator.className = "scroll-indicator";
scrollIndicator.innerHTML = `
    <div class="scroll-icon">
        <span class="scroll-arrow left"></span>
        <span class="mouse-wheel"></span>
        <span class="scroll-arrow right"></span>
    </div>
    <p>Défilez ici pour naviguer entre les personnages</p>
`;

    // Ajouter tous les éléments au conteneur
    container.appendChild(wrapper);
    container.appendChild(infoDiv);
    container.appendChild(scrollIndicator);

    // Configurer la zone de capture de défilement
    setupScrollZone();

    // Gérer le comportement de drag et swipe
    let startX = 0;
    wrapper.addEventListener("mousedown", (e) => startX = e.clientX);
    wrapper.addEventListener("mouseup", (e) => handleSwipe(startX, e.clientX));
    wrapper.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, { passive: true });
    wrapper.addEventListener("touchend", (e) => handleSwipe(startX, e.changedTouches[0].clientX));

    // Compter les interactions pour masquer l'indicateur
    wrapper.addEventListener("click", hideIndicatorAfterInteractions);
    document.addEventListener("wheel", hideIndicatorAfterInteractions, { passive: true });

    // Initialiser l'affichage du carousel
    updateCarousel();
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

// Gestion du swipe horizontal
const handleSwipe = (start, end) => {
    const diff = start - end;
    if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        hideIndicatorAfterInteractions();
    }
};

// Gestion du défilement vertical pour une navigation horizontale
// Remplacer la fonction throttleScroll existante par celle-ci:

const throttleScroll = (e) => {
    const container = document.getElementById('carousel-container');
    const rect = container.getBoundingClientRect();
    
    // Vérifier si l'utilisateur est directement sur le carousel (zone plus restreinte)
    const isDirectlyOnCarousel = 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom && 
        e.clientX >= rect.left && 
        e.clientX <= rect.right;
    
    if (isDirectlyOnCarousel) {
        // Bloquer le défilement de page uniquement lorsque la souris est directement sur le carousel
        e.preventDefault();
        
        // Si déjà en train de faire défiler, ignorer
        if (isScrolling) return;
        
        // Déterminer la direction et appliquer le défilement au carousel
        const delta = e.deltaY;
        if (Math.abs(delta) < 30) return; // Ignorer petits mouvements
        
        isScrolling = true;
        delta > 0 ? nextSlide() : prevSlide();
        
        // Ajouter un effet visuel pour indiquer la direction
        const wrapper = document.querySelector('.carousel-wrapper');
        wrapper.classList.add(delta > 0 ? 'swiping-left' : 'swiping-right');
        
        // Réinitialiser après l'animation
        setTimeout(() => {
            isScrolling = false;
            wrapper.classList.remove('swiping-left', 'swiping-right');
        }, 500);
        
        hideIndicatorAfterInteractions();
    }
    // Si on n'est pas directement sur le carousel, laisser le défilement normal se produire
};

// Faire disparaître l'indicateur après quelques interactions
const hideIndicatorAfterInteractions = () => {
    interactionCount++;
    if (interactionCount >= 3) {
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => {
                indicator.remove();
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

// Ajouter l'écouteur d'événement pour le défilement avec passive: false pour pouvoir utiliser preventDefault
document.addEventListener("wheel", throttleScroll, { passive: false });
// Ajouter cette fonction et son appel à la fin du fichier :

const setupSectionObserver = () => {
    const charactersSection = document.getElementById('characters-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Si on quitte la section, s'assurer que le défilement normal est restauré
                isScrolling = false;
            }
        });
    }, { threshold: 0.1 });
    
    if (charactersSection) {
        sectionObserver.observe(charactersSection);
    }
};

// Appel de la fonction d'observation
document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();
    setupSectionObserver();
});
