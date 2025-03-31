let characters = [];
let currentIndex = 0;

const fetchCharacters = async () => {
    try {
        const response = await fetch("/src/characters/characters.json");
        const data = await response.json();
        characters = data.characters;
        initCarousel();
    } catch (error) {
        console.error("Erreur lors de la récupération des personnages:", error);
    }
};

const initCarousel = () => {
    const container = document.getElementById("carousel-container");
    
    // Créer un wrapper pour le carrousel
    const wrapper = document.createElement("div");
    wrapper.className = "carousel-wrapper";
    
    // Créer les éléments du carrousel
    for (let i = 0; i < 5; i++) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "carousel-item";
        itemDiv.id = `item-${i}`;
        itemDiv.innerHTML = '<img src="" alt="">';
        
        // Ajouter l'événement de clic à chaque élément
        itemDiv.addEventListener("click", function() {
            // Déterminer le décalage par rapport à l'élément central (index 2)
            const offset = i - 2;
            
            // Si on clique sur l'élément central, ne rien faire
            if (offset === 0) return;
            
            // Mettre à jour l'index courant en fonction du décalage
            currentIndex = (currentIndex + offset + characters.length) % characters.length;
            updateCarousel();
        });
        
        wrapper.appendChild(itemDiv);
    }
    
    // Créer la zone d'information du personnage
    const infoDiv = document.createElement("div");
    infoDiv.className = "character-info";
    infoDiv.innerHTML = '<h3></h3><p></p>';
    
    // Créer les flèches de navigation
    const navDiv = document.createElement("div");
    navDiv.className = "carousel-nav";
    navDiv.innerHTML = `
        <div class="nav-arrow prev" id="prev-arrow">
            <span class="arrow-icon"></span>
        </div>
        <div class="nav-arrow next" id="next-arrow">
            <span class="arrow-icon"></span>
        </div>
    `;
        
    // Ajouter tous les éléments au container
    container.appendChild(wrapper);
    container.appendChild(navDiv);
    container.appendChild(infoDiv);
    
    // Ajouter les écouteurs d'événements pour les flèches
    document.getElementById("prev-arrow").addEventListener("click", prevSlide);
    document.getElementById("next-arrow").addEventListener("click", nextSlide);
    
    // Ajouter la navigation par glissement (swipe)
    let startX, endX;
    wrapper.addEventListener("mousedown", function(e) {
        startX = e.clientX;
    });
    
    wrapper.addEventListener("mouseup", function(e) {
        endX = e.clientX;
        if (startX - endX > 50) { // Swipe gauche
            nextSlide();
        } else if (endX - startX > 50) { // Swipe droite
            prevSlide();
        }
    });
    
    // Initialiser l'affichage
    updateCarousel();
};
const updateCarousel = () => {
    const positions = ["left-2", "left-1", "center", "right-1", "right-2"];
    const infoTitle = document.querySelector(".character-info h3");
    const infoText = document.querySelector(".character-info p");

    for (let i = 0; i < 5; i++) {
        const itemIndex = (currentIndex - 2 + i + characters.length) % characters.length;
        const character = characters[itemIndex];
        const itemElement = document.getElementById(`item-${i}`);

        // Appliquer une classe temporaire pour la transition
        itemElement.classList.add("moving");

        // Utiliser requestAnimationFrame pour attendre la prochaine frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Appliquer la nouvelle classe avec position mise à jour
                itemElement.className = `carousel-item ${positions[i]}`;

                // Supprimer la classe après la transition
                setTimeout(() => {
                    itemElement.classList.remove("moving");
                }, 600); // La durée doit être légèrement supérieure à la transition CSS
            });
        });

        // Mettre à jour l'image après un court délai
        setTimeout(() => {
            const img = itemElement.querySelector("img");
            img.src = character.image;
            img.alt = character.name;
        }, 100);
    }

    // Mettre à jour les informations du personnage central
    const centerCharacter = characters[currentIndex];
    infoTitle.textContent = centerCharacter.name;
    infoText.textContent = centerCharacter.film;
};


const nextSlide = () => {
    currentIndex = (currentIndex + 1) % characters.length;
    updateCarousel();
};

const prevSlide = () => {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
    updateCarousel();
};



document.addEventListener("DOMContentLoaded", fetchCharacters);