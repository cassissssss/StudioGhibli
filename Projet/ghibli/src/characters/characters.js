let characters = [];
let currentIndex = 0;

// Récupère les données des personnages depuis le fichier JSON
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

// Initialise le carrousel avec les éléments nécessaires
const initCarousel = () => {
    const container = document.getElementById("carousel-container");

    const wrapper = document.createElement("div");
    wrapper.className = "carousel-wrapper";

    for (let i = 0; i < 5; i++) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "carousel-item";
        itemDiv.id = `item-${i}`;
        itemDiv.innerHTML = '<img src="" alt="">';

        itemDiv.addEventListener("click", function () {
            const offset = i - 2;
            if (offset === 0) return;
            currentIndex = (currentIndex + offset + characters.length) % characters.length;
            updateCarousel();
        });

        wrapper.appendChild(itemDiv);
    }

    const infoDiv = document.createElement("div");
    infoDiv.className = "character-info";
    infoDiv.innerHTML = '<h4></h4><p></p>';

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

    container.appendChild(wrapper);
    container.appendChild(navDiv);
    container.appendChild(infoDiv);

    document.getElementById("prev-arrow").addEventListener("click", prevSlide);
    document.getElementById("next-arrow").addEventListener("click", nextSlide);

    let startX, endX;
    wrapper.addEventListener("mousedown", function (e) {
        startX = e.clientX;
    });

    wrapper.addEventListener("mouseup", function (e) {
        endX = e.clientX;
        if (startX - endX > 50) {
            nextSlide();
        } else if (endX - startX > 50) {
            prevSlide();
        }
    });

    updateCarousel();
};

// Met à jour l'affichage du carrousel et les informations du personnage sélectionné
const updateCarousel = () => {
    const positions = ["left-2", "left-1", "center", "right-1", "right-2"];
    const infoTitle = document.querySelector(".character-info h4");
    const infoText = document.querySelector(".character-info p");

    for (let i = 0; i < 5; i++) {
        const itemIndex = (currentIndex - 2 + i + characters.length) % characters.length;
        const character = characters[itemIndex];
        const itemElement = document.getElementById(`item-${i}`);

        itemElement.classList.add("moving");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itemElement.className = `carousel-item ${positions[i]}`;
                setTimeout(() => {
                    itemElement.classList.remove("moving");
                }, 600);
            });
        });

        setTimeout(() => {
            const img = itemElement.querySelector("img");
            img.src = character.image;
            img.alt = character.name;
        }, 100);
    }

    const centerCharacter = characters[currentIndex];
    infoTitle.textContent = centerCharacter.name;
    infoText.textContent = centerCharacter.film;
};

// Avance au personnage suivant
const nextSlide = () => {
    currentIndex = (currentIndex + 1) % characters.length;
    updateCarousel();
};

// Revient au personnage précédent
const prevSlide = () => {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
    updateCarousel();
};

document.addEventListener("DOMContentLoaded", fetchCharacters);