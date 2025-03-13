const fetchCharacters = async () => {
    try {
        const response = await fetch("characters.json"); // Charger le fichier JSON local
        const data = await response.json();

        displayCharacters(data.characters);
    } catch (error) {
        console.error("Erreur lors de la récupération des personnages:", error);
    }
};

const displayCharacters = (characters) => {
    const container = document.getElementById("character-container");
    container.innerHTML = "";
    
    characters.forEach(character => {
        const card = document.createElement("div");
        card.classList.add("character-card");
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <h3>${character.name}</h3>
            <p>${character.film}</p>
        `;
        container.appendChild(card);
    });
};

document.addEventListener("DOMContentLoaded", fetchCharacters);