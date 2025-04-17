
let ghibliTimeline = [];
let activeIndex = 0;
const CENTER_POSITION = 50;

// Charge et initialise la timeline à partir des données JSON
document.addEventListener('DOMContentLoaded', async function () {

    try {
        const response = await fetch('data-json/data_timeline.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        ghibliTimeline = await response.json();
        console.log('Données chargées:', ghibliTimeline);
        
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

        const position = (index / (ghibliTimeline.length - 1)) * 100;

        const yearMarker = document.createElement('div');
        yearMarker.className = 'year-marker';
        yearMarker.setAttribute('data-index', index);
        yearMarker.style.left = `${position}%`;

        const yearLabel = document.createElement('div');
        yearLabel.className = 'year-label';
        yearLabel.textContent = item.year;
        yearMarker.appendChild(yearLabel);

        yearMarkersContainer.appendChild(yearMarker);

        yearMarker.addEventListener('click', () => {
            updateActiveYear(index);
    
            scrollToSection(index);
        });
    });
    updateTimelinePosition(0);
}

// Génère les sections de contenu pour chaque année
function createSections() {
    const container = document.getElementById('sections-container');

    ghibliTimeline.forEach((item, index) => {
        const section = document.createElement('div');
        section.className = 'year-section';
        section.id = `section-${index}`;

        section.style.opacity = "1";

        const yearDisplay = document.createElement('div');
        yearDisplay.className = 'year-display';
        yearDisplay.textContent = item.year;

        const content = document.createElement('div');
        content.className = 'year-content';

        const image = document.createElement('img'); 
        image.className = 'year-image';
        image.src = `historique-img/ghibli-${item.year}.jpg`; 
        image.alt = `Studio Ghibli en ${item.year}`; 

        const description = document.createElement('div');
        description.className = 'year-description';
        description.textContent = item.description;

        content.appendChild(image);
        content.appendChild(description);

        section.appendChild(yearDisplay);
        section.appendChild(content);

        container.appendChild(section);
    });
  
}

// Initialiser GSAP ScrollTrigger
function initScrollTrigger() {

    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.year-section').forEach((section, index) => {
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

        tl.fromTo(section,
            { y: 100 },
            { y: 0, duration: 1 }
        );
    });

    gsap.to('.year-marker', {
        scrollTrigger: {
            trigger: '.sections-container',
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: self => {
                const progress = self.progress;

                const targetIndex = Math.round(progress * (ghibliTimeline.length - 1));

                updateTimelinePosition(targetIndex);
            }
        }
    });
}

// Ajuste la position des marqueurs d'années pour centrer l'année active
function updateTimelinePosition(activeIndex) {
    const totalYears = ghibliTimeline.length;
    const yearMarkers = document.querySelectorAll('.year-marker');

    const offset = CENTER_POSITION - (activeIndex / (totalYears - 1)) * 100;

    yearMarkers.forEach((marker, index) => {
        const basePosition = (index / (totalYears - 1)) * 100;
        const newPosition = basePosition + offset;
        marker.style.left = `${newPosition}%`;

        const isCentral = Math.abs(newPosition - CENTER_POSITION) < 1;

        if (isCentral) {
            marker.setAttribute('data-central', 'true');
        } else {
            marker.removeAttribute('data-central');
        }
    });
}

// Met à jour l'interface quand une nouvelle année devient active
function updateActiveYear(index) {
    activeIndex = index;

    document.querySelectorAll('.year-section').forEach((section, i) => {
        if (i === index) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    updateTimelinePosition(index);
}

// Fait défiler la page jusqu'à la section de l'année sélectionnée
function scrollToSection(index) {
    const section = document.getElementById(`section-${index}`);
    
    if (section) {

        section.style.scrollMarginTop = '250px';
        
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
        });
        
    }
}