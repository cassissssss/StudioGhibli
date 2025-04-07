// Ajoutez cette fonction au début de votre fichier popup.js
async function loadCharactersForFilm(filmName) {
    try {
        // Charger le fichier JSON contenant les personnages
        const response = await fetch('src/characters/characters.json');
        const data = await response.json();
        
        // Filtrer les personnages pour ce film spécifique (insensible à la casse)
        const filmCharacters = data.characters.filter(character => 
            character.film.toLowerCase() === filmName.toLowerCase()
        );
        
        // Si aucun personnage n'est trouvé pour ce film
        if (filmCharacters.length === 0) {
            return `<p>Personnages du film "${filmName}" non disponibles actuellement.</p>`;
        }
        
        // Générer le HTML pour la grille de personnages avec vos classes existantes
        return filmCharacters.map(character => `
            <div class="film-character-card">
                <div class="film-character-image">
                    <img src="${character.image}" alt="${character.name}">
                </div>
                <div class="film-character-name">${character.name}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error("Erreur lors du chargement des personnages:", error);
        return `<p>Impossible de charger les personnages.</p>`;
    }
}

function formatDuration(duration) {
    if (!duration) return "N/A";
    return duration.replace('h', ' h ').replace('m', ' min');
}

export function setupFilmPopup(filmsData, getCurrentIndex) {
    const popup = document.getElementById('popup-overlay');
    const popupBody = document.querySelector('.popup-body');
    const closeBtn = document.querySelector('.close-popup');
    
    document.addEventListener('click', async event => {
        const exploreBtn = event.target.closest('.film-explore');
        if (!exploreBtn) return;
        
        // Obtenir l'index actuel au moment du clic
        const currentIndex = getCurrentIndex();
        const film = filmsData[currentIndex];
        
        console.log("Affichage du popup pour:", film.name);
        
        // Obtenir le HTML de la grille de personnages
        const characterGridHTML = await loadCharactersForFilm(film.name);
        
        // Créer le contenu du pop-up avec TOUT le contenu
        const popupContent = `
            <div class="popup-header" style="background-image: url('${film.image}');">
                <div class="popup-title-bar">
                    <div class="popup-japanese-title">
                        ${film.japanese_title || ''}
                    </div>
                    <div class="popup-french-title">
                        <h1 class="popup-title">${film.name}</h1>
                    </div>
                </div>
                <div class="popup-rating">
                    <span class="film-rating-score">${film.rating || '?'}/10</span>
                    <span class="star">⭐</span>
                </div>
            </div>
            
            <div class="popup-two-columns">
                <div class="popup-left-column">
                    <div class="popup-description">
                        <p>${film.description || 'Pas de description disponible.'}</p>
                    </div>
                    
                    <div class="popup-details">
                        <div class="popup-detail-item">
                            <h3>Producteur</h3>
                            <div class="detail-value">${film.director === "Hayao Miyazaki" ? "Isao Takahata" : "Toshio Suzuki"}</div>
                        </div>
                        <div class="popup-detail-item">
                            <h3>Année de sortie</h3>
                            <div class="detail-value">${film.year || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="popup-details">
                        <div class="popup-detail-item">
                            <h3>Directeur</h3>
                            <div class="detail-value">${film.director || 'N/A'}</div>
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
            <div class="film-popup-characters-container">
                ${characterGridHTML}
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

