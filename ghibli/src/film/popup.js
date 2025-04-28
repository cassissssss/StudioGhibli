// Ajoutez cette fonction au début de votre fichier popup.js
async function loadCharactersForFilm(filmName) {
    try {
        // Charger le fichier JSON contenant les personnages
        const response = await fetch('data-json/characters.json');
        const data = await response.json();
        
        const filmCharacters = data.characters.filter(character => 
            character.film.toLowerCase() === filmName.toLowerCase()
        );
        
        if (filmCharacters.length === 0) {
            return `<p>Personnages du film "${filmName}" non disponibles actuellement.</p>`;
        }
        
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

    // Gestionnaire pour l'ouverture du popup
    document.addEventListener('click', async event => {
        const exploreBtn = event.target.closest('.film-explore');
        if (!exploreBtn) return;
        
        const currentIndex = getCurrentIndex();
        const film = filmsData[currentIndex];
        
        console.log("Affichage du popup pour:", film.name);
        
        const thumbnailUrl = `https://img.youtube.com/vi/${film.youtubeTrailerId || 'dQw4w9WgXcQ'}/maxresdefault.jpg`;
        
        const characterGridHTML = await loadCharactersForFilm(film.name);
        
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
                        <div class="youtube-embed" data-id="${film.youtubeTrailerId || ''}">
                            <div class="video-placeholder" style="background-image: url('${thumbnailUrl}')">
                                <div class="film-play-button">▶</div>
                            </div>
                        </div>
                    </div>
                    
                    <h2 class="section-title">Musiques du film</h2>
                    <div class="music-player">
                        ${film.spotifyPlaylistId ? 
                            `<iframe 
                                style="border-radius:12px" 
                                src="https://open.spotify.com/embed/album/${film.spotifyPlaylistId}?utm_source=generator&theme=0" 
                                width="100%" 
                                height="152" 
                                frameBorder="0" 
                                allowfullscreen="" 
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                loading="lazy"
                                class="spotify-iframe">
                            </iframe>` : 
                            `<div class="spotify-player">
                                <div class="music-album-art">
                                    <img src="${film.image}" alt="${film.name} soundtrack">
                                </div>
                                <div class="music-info">
                                    <div class="music-title">Bande originale de ${film.name}</div>
                                    <div class="music-artist">Joe Hisaishi</div>
                                </div>
                                <div class="music-controls">
                                    <span class="play-button">▶</span>
                                </div>
                            </div>`
                        }
                    </div>
                </div>
            </div>
            
            <h2 class="section-title">Personnages du film</h2>
            <div class="film-popup-characters-container">
                ${characterGridHTML}
            </div>
        `;
        
        popupBody.innerHTML = popupContent;

        
        const detectArea = document.createElement('div');
        detectArea.className = 'scroll-detection-area';
        popupBody.appendChild(detectArea);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    enableHorizontalScrollWithWheel();
                } else {
                    disableHorizontalScrollWithWheel();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(detectArea);

        const charactersContainer = document.querySelector('.film-popup-characters-container');
        let horizontalScrollEnabled = false;

        function enableHorizontalScrollWithWheel() {
            horizontalScrollEnabled = true;
        }

        function disableHorizontalScrollWithWheel() {
            horizontalScrollEnabled = false;
        }

        popupBody.addEventListener('wheel', function(event) {
            if (horizontalScrollEnabled) {
                const isAtStart = charactersContainer.scrollLeft <= 0;
                const isScrollingUp = event.deltaY < 0;
                
                if (isAtStart && isScrollingUp) {
                    return;
                }
                event.preventDefault();
                const scrollSpeed = 4;
                
                
                charactersContainer.scrollLeft += event.deltaY * scrollSpeed;
            }
        }, { passive: false });
        
        popup.classList.add('popup-show');
        disableBodyScroll();
    });
    document.addEventListener('click', function(event) {
        if (event.target.closest('.film-play-button') && event.target.closest('.youtube-embed')) {
            const container = event.target.closest('.youtube-embed');
            const videoId = container.dataset.id;
            
            if (!videoId) return;
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            container.innerHTML = '';
            container.appendChild(iframe);
            
            container.classList.add('active');
        }
    }, { capture: true });
    
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('popup-show');
        enableBodyScroll();
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('popup-show');
            enableBodyScroll();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('popup-show')) {
            popup.classList.remove('popup-show');
            enableBodyScroll();
        }
    });
}

function disableBodyScroll() {
    const scrollY = window.scrollY;
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.scrollY = scrollY;
}

function enableBodyScroll() {
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    window.scrollTo(0, scrollY);
}
