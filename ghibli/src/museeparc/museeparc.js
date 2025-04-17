const museeImages = [
    'museeparc-img/musee1.png',
    'museeparc-img/musee2.png',
    'museeparc-img/musee3.png',
    'museeparc-img/musee4.png',
    'museeparc-img/musee5.png'
];

const parcImages = [
    'museeparc-img/parc1.png',
    'museeparc-img/parc2.png',
    'museeparc-img/parc3.png',
    'museeparc-img/parc4.png',
    'museeparc-img/parc5.png'
];

function createMuseeParcSection() {
    const container = document.querySelector('.museeparc-container');

    // Créer une grille pour les deux colonnes
    const grid = document.createElement('div');
    grid.className = 'museeparc-grid';

    // Créer les colonnes pour le musée et le parc
    const museeColumn = document.createElement('div');
    museeColumn.className = 'museeparc-column';

    const parcColumn = document.createElement('div');
    parcColumn.className = 'museeparc-column';

    // Ajouter les titres
    museeColumn.innerHTML = '<h3>Musée</h3>';
    parcColumn.innerHTML = '<h3>Parc</h3>';

    // Créer les conteneurs d'images
    const museeStack = document.createElement('div');
    museeStack.className = 'image-stack';

    const parcStack = document.createElement('div');
    parcStack.className = 'image-stack';

    // Ajouter les images empilées
    museeImages.forEach((src, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        wrapper.innerHTML = `<img src="${src}" alt="Musée Ghibli ${index + 1}">`;
        museeStack.appendChild(wrapper);
    });

    parcImages.forEach((src, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        wrapper.innerHTML = `<img src="${src}" alt="Parc Ghibli ${index + 1}">`;
        parcStack.appendChild(wrapper);
    });

    // Ajouter les piles d'images aux colonnes
    museeColumn.appendChild(museeStack);
    parcColumn.appendChild(parcStack);

    // Assembler la grille
    grid.appendChild(museeColumn);
    grid.appendChild(parcColumn);
    container.appendChild(grid);

    // Initialiser l'effet de scroll
    initScrollEffect();
}

function initScrollEffect() {
    const section = document.querySelector('#museeparc-section');
    const imageStacks = document.querySelectorAll('.image-stack');

    window.addEventListener('scroll', () => {
        const sectionRect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Ne rien faire si la section n'est pas encore complètement visible
        if (sectionRect.top > 0) {
            // Réinitialiser toutes les images à leur état initial
            imageStacks.forEach(stack => {
                const images = stack.querySelectorAll('.image-wrapper');
                images.forEach(img => {
                    img.style.opacity = 1;
                    img.style.transform = 'translateY(0) scale(1)';
                });
            });
            return;
        }

        // Commence l'animation seulement quand la section est complètement visible
        const scrollStart = section.offsetTop;
        const scrollEnd = scrollStart + section.offsetHeight - windowHeight;
        const currentScroll = window.pageYOffset;
        const scrollProgress = Math.max(0, Math.min(1,
            (currentScroll - scrollStart) / (scrollEnd - scrollStart)
        ));

        imageStacks.forEach(stack => {
            const images = stack.querySelectorAll('.image-wrapper');
            const totalImages = images.length;

            images.forEach((img, index) => {
                const startThreshold = (index / totalImages) * 0.8;
                const endThreshold = ((index + 1) / totalImages) * 0.8;

                let opacity = 1;
                let scale = 1;
                let translateY = 0;

                if (scrollProgress > startThreshold) {
                    const progress = Math.min(1, (scrollProgress - startThreshold) / (endThreshold - startThreshold));
                    opacity = 1 - progress;
                    scale = 1 - (progress * 0.1);
                    translateY = -30 * progress;
                }

                img.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                img.style.opacity = opacity;
                img.style.transform = `
                    translateY(${translateY}px) 
                    scale(${scale})
                `;
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', createMuseeParcSection);