import './style.css'


// Ajout des boutons de navigation globaux
document.addEventListener('DOMContentLoaded', () => {
  addNavigationButtons();
});

/**
 * Ajoute les boutons de navigation flottants pour naviguer entre les sections
 */
function addNavigationButtons() {
  // Définir toutes les sections dans l'ordre
  const sections = [
    { name: 'introduction', selector: '.hero' },
    { name: 'historique', selector: '#historique-section' },
    { name: 'carte', selector: '#map-section' },
    { name: 'personnages', selector: '#characters-section' },
    { name: 'films', selector: '#film-section' },
    { name: 'anecdotes', selector: '.anecdotes-container' },
    { name: 'classement', selector: '#graphique-section' }
  ];

  // Fonction pour déterminer quelle section est actuellement visible
  function getCurrentSectionIndex() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let currentIndex = 0;
    let minDistance = Infinity;
    
    sections.forEach((section, index) => {
      const element = document.querySelector(section.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const distance = Math.abs(scrollPos - sectionTop);
        
        if (distance < minDistance) {
          minDistance = distance;
          currentIndex = index;
        }
      }
    });
    
    return currentIndex;
  }
  
  // Créer le conteneur pour les boutons
  const navContainer = document.createElement('div');
  navContainer.className = 'navigation-buttons';
  
  // Bouton vers le haut (section précédente)
  const upButton = document.createElement('button');
  upButton.className = 'nav-button up-button';
  upButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="#fff" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"></path>
    </svg>
  `;
  upButton.addEventListener('click', () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex > 0) {
      // Naviguer vers la section précédente
      const prevSection = document.querySelector(sections[currentIndex - 1].selector);
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si c'est la première section, aller en haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  // Bouton vers le bas (section suivante)
  const downButton = document.createElement('button');
  downButton.className = 'nav-button down-button';
  downButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="#fff" d="M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z"></path>
    </svg>
  `;
  downButton.addEventListener('click', () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex < sections.length - 1) {
      // Naviguer vers la section suivante
      const nextSection = document.querySelector(sections[currentIndex + 1].selector);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  
  // Mettre à jour l'état des boutons en fonction de la position actuelle
  function updateButtonsState() {
    const currentIndex = getCurrentSectionIndex();
    
    // Désactiver le bouton haut si on est à la première section
    if (currentIndex <= 0) {
      upButton.classList.add('disabled');
      upButton.style.opacity = '0.5';
    } else {
      upButton.classList.remove('disabled');
      upButton.style.opacity = '1';
    }
    
    // Désactiver le bouton bas si on est à la dernière section
    if (currentIndex >= sections.length - 1) {
      downButton.classList.add('disabled');
      downButton.style.opacity = '0.5';
    } else {
      downButton.classList.remove('disabled');
      downButton.style.opacity = '1';
    }
  }
  
  // Ajouter les boutons au conteneur
  navContainer.appendChild(upButton);
  navContainer.appendChild(downButton);
  
  
  // Ajouter le conteneur au corps du document
  document.body.appendChild(navContainer);
  
  // Mettre à jour l'état des boutons initialement
  updateButtonsState();
  
  // Mettre à jour l'état des boutons lors du défilement
  window.addEventListener('scroll', updateButtonsState);
}

