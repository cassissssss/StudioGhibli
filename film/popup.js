function setupPopup() {
    const popup = document.getElementById('popup-overlay');
    const popupBody = document.querySelector('.popup-body');
    const closeBtn = document.querySelector('.close-popup');
    const exploreBtn = document.querySelector('.explore');
    
    // Ouvrir le popup au clic sur le bouton Explorer
    exploreBtn.addEventListener('click', () => {
        const film = films[currentIndex];
        
        // Créer le contenu du pop-up
        const popupContent = `
            <div class="popup-header" style="background-image: url('${film.image}');">
                <div class="popup-title-bar">
                    <div class="popup-japanese-title">
                        ${film.japanese_title}
                    </div>
                    <div class="popup-french-title">
                        <h1 class="popup-title">${film.name}</h1>
                    </div>
                </div>
                <div class="popup-rating">
                    <span class="film-rating-score">${film.rating}</span>
                    <span class="star">⭐</span>
                </div>
            </div>
            
            <div class="popup-two-columns">
                <div class="popup-left-column">
                    <div class="popup-description">
                        <p>${film.description}</p>
                    </div>
                    
                    <div class="popup-details">
                        <div class="popup-detail-item">
                            <h3>Producteur</h3>
                            <div class="detail-value">${film.director === "Hayao Miyazaki" ? "Isao Takahata" : "Toshio Suzuki"}</div>
                        </div>
                        <div class="popup-detail-item">
                            <h3>Année de sortie</h3>
                            <div class="detail-value">${film.year}</div>
                        </div>
                    </div>
                    
                    <div class="popup-details">
                        <div class="popup-detail-item">
                            <h3>Directeur</h3>
                            <div class="detail-value">${film.director}</div>
                        </div>
                        <div class="popup-detail-item">
                            <h3>Durée</h3>
                            <div class="detail-value">${formatDuration(film.duration)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="popup-right-column">
                    <h2 class="section-title">Bande annonce</h2>
                    <div class="trailer-container">
                        <div class="video-placeholder">
                            <div class="play-button">▶</div>
                        </div>
                    </div>
                    
                    <h2 class="section-title">Musiques du film</h2>
                    <div class="music-player">
                        <div class="spotify-player">
                            <div class="music-album-art">
                                <img src="${film.image}" alt="${film.name} soundtrack">
                            </div>
                            <div class="music-info">
                                <div class="music-title">The Girl Who Fell From the Sky</div>
                                <div class="music-artist">Joe Hisaishi</div>
                            </div>
                            <div class="music-controls">
                                <span class="add-button">+</span>
                                <span class="more-button">...</span>
                                <span class="play-button">▶</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <h2 class="section-title">Personnages du film</h2>
            <div class="characters-container">
                ${createCharacterGrid(film.name)}
            </div>
        `;
        
        // Insérer le contenu
        popupBody.innerHTML = popupContent;
        
        // Afficher le popup
        popup.classList.add('popup-show');
    });
    
    // Fermer le popup au clic sur le bouton de fermeture
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('popup-show');
    });
    
    // Fermer le popup en cliquant en dehors du contenu
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('popup-show');
        }
    });
    
    // Fermer le popup avec la touche Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('popup-show')) {
            popup.classList.remove('popup-show');
        }
    });
}

// Fonction pour formater la durée au format "2h14m"
function formatDuration(duration) {
    // Si la durée est déjà au format souhaité, on la retourne telle quelle
    if (/\d+h\d+m/.test(duration)) {
        return duration;
    }
    
    // Si la durée est juste un nombre (minutes), on la convertit
    if (!isNaN(duration)) {
        const minutes = parseInt(duration);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h${remainingMinutes}m`;
    }
    
    // Si la durée est au format "X minutes", on extrait et convertit
    const minutesMatch = duration.match(/(\d+)/);
    if (minutesMatch) {
        const totalMinutes = parseInt(minutesMatch[1]);
        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        return `${hours}h${remainingMinutes}m`;
    }
    
    return duration; // Retourne la durée originale si aucun format reconnu
}

// Fonction pour créer la grille de personnages en fonction du film
function createCharacterGrid(filmName) {
    let characters = [];
    
    // Définir les personnages en fonction du film
    switch(filmName) {
        case "Le Château dans le ciel":
            characters = [
                { name: "Sheeta", image: "../data/characters/sheeta.jpg" },
                { name: "Pazu", image: "../data/characters/pazu.jpg" },
                { name: "Dola", image: "../data/characters/dola.jpg" },
                { name: "Muska", image: "../data/characters/muska.jpg" },
                { name: "Le Général", image: "../data/characters/general.jpg" }
            ];
            break;
        case "Princesse Mononoké":
            characters = [
                { name: "San", image: "../data/characters/san.jpg" },
                { name: "Ashitaka", image: "../data/characters/ashitaka.jpg" },
                { name: "Dame Eboshi", image: "../data/characters/eboshi.jpg" },
                { name: "Jiko", image: "../data/characters/jiko.jpg" },
                { name: "Moro", image: "../data/characters/moro.jpg" }
            ];
            break;
        // Ajouter d'autres films au besoin
        default:
            characters = [
                { name: "Personnage 1", image: "../data/characters/default.jpg" },
                { name: "Personnage 2", image: "../data/characters/default.jpg" },
                { name: "Personnage 3", image: "../data/characters/default.jpg" },
                { name: "Personnage 4", image: "../data/characters/default.jpg" },
                { name: "Personnage 5", image: "../data/characters/default.jpg" }
            ];
    }
    
    // Créer les éléments HTML pour chaque personnage
    return characters.map(character => `
        <div class="character-card">
            <div class="character-image">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div class="character-name">${character.name}</div>
        </div>
    `).join('');
}