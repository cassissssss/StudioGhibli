// Données des années Ghibli
let ghibliTimeline = [];

// Variable pour suivre l'index actif
let activeIndex = 0;
// Constante qui définit le marqueur central (point médian)
const CENTER_POSITION = 50;

document.addEventListener('DOMContentLoaded', async function () {
    // Charger les données JSON
    try {
        const response = await fetch('/src/historique/data_timeline.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        ghibliTimeline = await response.json();
        console.log('Données chargées:', ghibliTimeline);
        
        // Initialiser l'interface après avoir chargé les données
        initTimeline();
        createSections();
        initScrollTrigger();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
});

// Créer les marqueurs d'années sur la timeline
function initTimeline() {
    const yearMarkersContainer = document.getElementById('year-markers');

    ghibliTimeline.forEach((item, index) => {
        // Calculer la position horizontale (pourcentage)
        const position = (index / (ghibliTimeline.length - 1)) * 100;

        // Créer le marqueur d'année
        const yearMarker = document.createElement('div');
        yearMarker.className = 'year-marker';
        yearMarker.setAttribute('data-index', index);
        yearMarker.style.left = `${position}%`;

        // Ajouter l'étiquette d'année
        const yearLabel = document.createElement('div');
        yearLabel.className = 'year-label';
        yearLabel.textContent = item.year;
        yearMarker.appendChild(yearLabel);

        // Ajouter le marqueur au conteneur
        yearMarkersContainer.appendChild(yearMarker);

        // Ajouter un événement de clic pour naviguer
        yearMarker.addEventListener('click', () => {
            updateActiveYear(index);
    
            scrollToSection(index);
        });
    });
    updateTimelinePosition(0);
}

function createSections() {
    const container = document.getElementById('sections-container');

    ghibliTimeline.forEach((item, index) => {
        const section = document.createElement('div');
        section.className = 'year-section';
        section.id = `section-${index}`;

        // Définir l'opacité à 1 initialement au lieu de 0
        section.style.opacity = "1";

        // Affichage de l'année
        const yearDisplay = document.createElement('div');
        yearDisplay.className = 'year-display';
        yearDisplay.textContent = item.year;

        // Contenu (image + description)
        const content = document.createElement('div');
        content.className = 'year-content';

        // Image réelle au lieu du placeholder
        const image = document.createElement('img'); // Changé de div à img
        image.className = 'year-image';
        image.src = `historique-img/ghibli-${item.year}.jpg`; // Utiliser une convention de nommage pour les images
        image.alt = `Studio Ghibli en ${item.year}`; // Ajouter un texte alternatif pour l'accessibilité

        // Description
        const description = document.createElement('div');
        description.className = 'year-description';
        description.textContent = item.description;

        // Assembler les éléments
        content.appendChild(image);
        content.appendChild(description);

        section.appendChild(yearDisplay);
        section.appendChild(content);

        container.appendChild(section);
    });
    document.getElementById("skipButton").addEventListener("click", () => {
        document.querySelector("#map-section").scrollIntoView({ behavior: "smooth" });
    });
    
}

// Initialiser GSAP ScrollTrigger
function initScrollTrigger() {
    // Enregistrer le plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animation pour chaque section
    document.querySelectorAll('.year-section').forEach((section, index) => {
        // Créer un timeline pour chaque section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top center",
                end: "bottom center",
                scrub: true,
                onEnter: () => updateActiveYear(index),
                onEnterBack: () => updateActiveYear(index)
            }
        });

        // Animation modifiée pour ne pas affecter l'opacité
        tl.fromTo(section,
            { y: 100 },
            { y: 0, duration: 1 }
        );
    });

    // Animation pour les marqueurs de la timeline
    gsap.to('.year-marker', {
        scrollTrigger: {
            trigger: '.sections-container',
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: self => {
                // Calculer la progression entre 0 et 1
                const progress = self.progress;

                // Calculer l'index approximatif basé sur la progression
                const targetIndex = Math.round(progress * (ghibliTimeline.length - 1));

                // Mettre à jour la position des marqueurs
                updateTimelinePosition(targetIndex);
            }
        }
    });
}

// Mettre à jour la position des marqueurs sur la timeline
function updateTimelinePosition(activeIndex) {
    const totalYears = ghibliTimeline.length;
    const yearMarkers = document.querySelectorAll('.year-marker');

    // Calculer le décalage pour centrer l'année active
    const offset = CENTER_POSITION - (activeIndex / (totalYears - 1)) * 100;

    // Déplacer tous les marqueurs
    yearMarkers.forEach((marker, index) => {
        const basePosition = (index / (totalYears - 1)) * 100;
        const newPosition = basePosition + offset;
        marker.style.left = `${newPosition}%`;

        // Vérifier si ce marqueur est au centre ou très proche du centre
        const isCentral = Math.abs(newPosition - CENTER_POSITION) < 1;

        if (isCentral) {
            marker.setAttribute('data-central', 'true');
        } else {
            marker.removeAttribute('data-central');
        }
    });
}

// Mettre à jour l'année active
function updateActiveYear(index) {
    activeIndex = index;

    // Mettre à jour les sections (sans changer l'opacité)
    document.querySelectorAll('.year-section').forEach((section, i) => {
        if (i === index) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Mettre à jour la timeline
    updateTimelinePosition(index);
}

function scrollToSection(index) {
    const section = document.getElementById(`section-${index}`);
    
    if (section) {
        // 1. Ajouter une marge temporaire pour le scroll
        // Cette marge crée un espace au-dessus de la section pour compenser le header
        section.style.scrollMarginTop = '250px'; // Ajustez cette valeur à la hauteur de votre header + espace souhaité
        
        // 2. Utiliser scrollIntoView avec block: 'start'
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' // Aligner le haut de la section (avec la marge)
        });
        
        // 3. Option: Restaurer la marge après le scroll
        // setTimeout(() => {
        //    section.style.scrollMarginTop = '0';
        // }, 1000);
    }
}