let characters = [];
let currentIndex = 0;
let isScrolling = false;

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
            }
        });

        wrapper.appendChild(itemDiv);
    }

    const infoDiv = document.createElement("div");
    infoDiv.className = "character-info";
    infoDiv.innerHTML = '<h4></h4><p></p>';

    container.append(wrapper, infoDiv);

    // Gérer drag et swipe
    let startX = 0;
    wrapper.addEventListener("mousedown", (e) => startX = e.clientX);
    wrapper.addEventListener("mouseup", (e) => handleSwipe(startX, e.clientX));
    wrapper.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, { passive: true });
    wrapper.addEventListener("touchend", (e) => handleSwipe(startX, e.changedTouches[0].clientX));

    // Scroll vertical qui contrôle horizontalement le carousel
    document.addEventListener("wheel", throttleScroll, { passive: false });

    updateCarousel();
};

const handleSwipe = (start, end) => {
    const diff = start - end;
    if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
    }
};

const throttleScroll = (e) => {
    const section = document.getElementById('characters-section');
    const rect = section.getBoundingClientRect();

    if (rect.top <= 0 && rect.bottom > window.innerHeight / 2) {
        e.preventDefault();
        if (isScrolling) return;

        const delta = e.deltaY;
        if (Math.abs(delta) < 30) return; // Ignore petits mouvements

        isScrolling = true;
        delta > 0 ? nextSlide() : prevSlide();

        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }
};

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
