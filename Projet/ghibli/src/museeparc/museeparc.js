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
    museeColumn.innerHTML = '<h2>Musée</h2>';
    parcColumn.innerHTML = '<h2>Parc</h2>';

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
        // Vérifier si la section est dans le viewport
        const sectionRect = section.getBoundingClientRect();

        // Ne rien faire si la section n'est pas visible
        if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) {
            return;
        }

        // Calculer la position relative dans la section
        const sectionProgress = Math.max(0, Math.min(1,
            -sectionRect.top / (section.offsetHeight - window.innerHeight)
        ));

        imageStacks.forEach(stack => {
            const images = stack.querySelectorAll('.image-wrapper');
            const totalImages = images.length;

            images.forEach((img, index) => {
                const threshold = index / totalImages;

                if (sectionProgress > threshold) {
                    img.style.opacity = '0';
                    img.style.transform = 'translateY(-30px)';
                } else {
                    img.style.opacity = '1';
                    img.style.transform = 'translateY(0)';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', createMuseeParcSection);