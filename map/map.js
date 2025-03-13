// Définition des dimensions et des variables globales
const width = window.innerWidth;
const height = window.innerHeight;
let userScrolling = false;
let currentLocationIndex = -1;
const tooltip = d3.select(".tooltip");

// Création du SVG et du groupe pour la carte
const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

const g = svg.append("g");

// Projection de la carte
const projection = d3.geoNaturalEarth1()
    .scale(width /3)
    .translate([width / 6, height / 2]);

const path = d3.geoPath().projection(projection);

// Configuration du zoom
const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
        if (userScrolling) {
            g.attr("transform", event.transform);
        }
    });

svg.call(zoom);

// Fonction pour créer les sections de scrollytelling dynamiquement
function createSections(locations) {
    const container = d3.select(".sections-container");
    
    // Ajouter une section pour chaque lieu
    locations.forEach((location, i) => {
        container.append("div")
            .attr("class", "step")
            .attr("id", `step-${i}`)
            .html(`
                <div class="info-box">
                    <img src="${location.image_film}" alt="${location.name}" class="film-image">
                    <img src="${location.image_reel}" alt="${location.name}" class="location-image">
                    <h2 class="location-name" style="border-color: ${location.color}">${location.name}</h2>
                    <div class="film-title">Film : ${location.film}</div>
                    <div class="country">Pays : ${location.country}</div>
                    
                </div>
            `);
    });
}

// Charger la carte et les données
Promise.all([
    d3.json("https://d3js.org/world-110m.v1.json"),
    d3.json("map-data.json")
]).then(([world, locations]) => {
    // Créer les sections HTML pour le scrollytelling
    createSections(locations);
    
    // Dessiner les pays
    const countries = topojson.feature(world, world.objects.countries);
    g.append("g")
        .selectAll("path")
        .data(countries.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "#e8e8e8")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

    // Ajouter les points d'intérêt
    const points = g.append("g")
        .selectAll("circle")
        .data(locations)
        .enter().append("circle")
        .attr("cx", d => projection(d.coords)[0])
        .attr("cy", d => projection(d.coords)[1])
        .attr("r", 8)
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("class", "location-point")
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                .html(`<strong>${d.name}</strong><br>${d.film}`)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 30) + "px");
            
            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", 12);
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            
            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", 8);
        });
    
    // Ajouter des labels pour les lieux
    g.append("g")
        .selectAll("text")
        .data(locations)
        .enter().append("text")
        .attr("x", d => projection(d.coords)[0])
        .attr("y", d => projection(d.coords)[1] - 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "8px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .attr("pointer-events", "none")
        .text(d => d.name);

    // Configuration initiale : vue d'ensemble
    const initialTransform = d3.zoomIdentity
        .translate(width/2, height/2)
        .scale(1);
    
    svg.call(zoom.transform, initialTransform);

    // Gérer le défilement pour le scrollytelling
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si une section est visible
            if (entry.isIntersecting) {
                const stepId = entry.target.id;
                const stepIndex = stepId === "step-intro" ? -1 : parseInt(stepId.split("-")[1]);
                
                // Trouver la boîte d'info dans cette section
                const infoBox = entry.target.querySelector(".info-box");
                
                // Active la boîte d'info avec une animation
                if (infoBox) {
                    infoBox.classList.add("active");
                }
                
                // Si ce n'est pas l'intro et qu'on change de section
                if (stepIndex !== -1 && stepIndex !== currentLocationIndex) {
                    currentLocationIndex = stepIndex;
                    const location = locations[stepIndex];
                    
                    // Zoom sur le lieu correspondant
                    userScrolling = true;
                    
                    // Calculer le niveau de zoom approprié
                    const [x, y] = projection(location.coords);
                    const scale = 3;//zoom de la carte
                    
                    svg.transition()
                        .duration(1500)
                        .call(
                            zoom.transform,
                            d3.zoomIdentity
                                .translate(width/2 - x*scale, height/2 - y*scale)
                                .scale(scale)
                        )
                        .on("end", () => {
                            userScrolling = false;
                        });
                    
                    // Mettre en évidence le point actuel
                    points
                        .transition()
                        .duration(500)
                        .attr("r", d => d === location ? 10 : 5) //taille des points
                        .attr("stroke-width", d => d === location ? 3 : 2);
                } 
                // Si c'est l'intro, revenir à la vue d'ensemble
                else if (stepIndex === -1) {
                    userScrolling = true;
                    
                    svg.transition()
                        .duration(1500)
                        .call(zoom.transform, initialTransform)
                        .on("end", () => {
                            userScrolling = false;
                        });
                    
                    points
                        .transition()
                        .duration(500)
                        .attr("r", 8)
                        .attr("stroke-width", 2);
                        
                    currentLocationIndex = -1;
                }
            } else {
                // Si la section n'est plus visible, désactiver l'info box
                const infoBox = entry.target.querySelector(".info-box");
                if (infoBox) {
                    infoBox.classList.remove("active");
                }
            }
        });
    }, {
        threshold: 0.7, // Niveau de visibilité requis pour déclencher l'observateur
        rootMargin: "0px"
    });

    // Observer toutes les sections
    document.querySelectorAll('.step').forEach(step => {
        observer.observe(step);
    });
    
    // Gérer le défilement
    let lastScrollPosition = 0;
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.scrollY;
        lastScrollPosition = currentScrollPosition;
    });
    
    // Ajuster les dimensions en cas de redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        svg.attr("width", newWidth)
           .attr("height", newHeight);
        
        projection.translate([newWidth / 2, newHeight / 2]);
        
        // Mettre à jour les positions des éléments
        g.selectAll("path").attr("d", path);
        g.selectAll("circle")
            .attr("cx", d => projection(d.coords)[0])
            .attr("cy", d => projection(d.coords)[1]);
        g.selectAll("text")
            .attr("x", d => projection(d.coords)[0])
            .attr("y", d => projection(d.coords)[1] - 15);
    });
});
document.getElementById("skipButton").addEventListener("click", function() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"  // Animation fluide (optionnel)
    });
});
