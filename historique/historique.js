// Données des années Ghibli
const ghibliTimeline = [
    {
        year: "1983",
        description: "Après le succès de Nausicaä de la Vallée du Vent (1984), Hayao Miyazaki, Isao Takahata et le producteur Toshio Suzuki envisagent de créer un studio dédié à l'animation, qui verra le jour en 1985."
    },
    {
        year: "1986",
        description: "Sortie du premier film Ghibli, Le Château dans le ciel (Tenkū no Shiro Rapyuta), un film d'aventure steampunk qui pose les bases du style Ghibli."
    },
    {
        year: "1988",
        description: "Double sortie marquante avec Mon voisin Totoro et Le Tombeau des lucioles. Totoro devient l'emblème du studio."
    },
    {
        year: "1989",
        description: "Succès de Kiki la petite sorcière, qui confirme la capacité du studio à toucher un large public."
    },
    {
        year: "1991",
        description: "Sortie de Porco Rosso, un film sur l'aviation inspiré par la passion de Miyazaki pour les avions."
    },
    {
        year: "1996",
        description: "Ghibli signe un accord de distribution avec Disney, ce qui aide à populariser les films en dehors du Japon."
    },
    {
        year: "1997",
        description: "Princesse Mononoké marque un tournant avec un succès critique et commercial immense au Japon (premier film à dépasser 100 millions $)."
    },
    {
        year: "2001",
        description: "Sortie de Le Voyage de Chihiro, qui devient un phénomène mondial et remporte l'Oscar du meilleur film d'animation en 2003."
    },
    {
        year: "2004",
        description: "Le Château ambulant connaît un succès international, avec une reconnaissance à Cannes."
    },
    {
        year: "2013",
        description: "Miyazaki annonce sa retraite après Le Vent se lève."
    },
    {
        year: "2015",
        description: "Le studio entre en hiatus après la retraite de Miyazaki. Takahata décède en 2018."
    },
    {
        year: "2023",
        description: "Sortie de Le Garçon et le Héron, premier film Ghibli à gagner un Golden Globe et un BAFTA."
    },
    {
        year: "2024",
        description: "Le film remporte l'Oscar du meilleur film d'animation, confirmant l'héritage du studio."
    },
];

// Variable pour suivre l'index actif
let activeIndex = 0;
// Constante qui définit le marqueur central (point médian)
const CENTER_POSITION = 50;

// Initialisation
document.addEventListener('DOMContentLoaded', function () {
    initTimeline();
    createSections();
    initScrollTrigger();
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
            scrollToSection(index);
        });
    });
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
        image.src = `img/ghibli-${item.year}.jpg`; // Utiliser une convention de nommage pour les images
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

// Fonction pour scroll vers une section spécifique
function scrollToSection(index) {
    const section = document.getElementById(`section-${index}`);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 200,
            behavior: 'smooth'
        });
    }
}