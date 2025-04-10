import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm";
import scrollama from "https://cdn.skypack.dev/scrollama";

// Configuration initiale
const width = window.innerWidth;
const height = window.innerHeight;
let userScrolling = false;
let currentLocationIndex = -1;
const tooltip = d3.select(".tooltip");

// SVG et groupe pour la carte
const svg = d3.select("#map").attr("width", width).attr("height", height);
const g = svg.append("g");

// Projection cartographique
const projection = d3.geoNaturalEarth1().scale(width / 3).translate([width / 6, height / 2]);
const path = d3.geoPath().projection(projection);

// Zoom
const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
        if (userScrolling) g.attr("transform", event.transform);
    });

svg.call(zoom);

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function () {
    const mapSectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !window.mapInitialized) {
                    initializeMap();
                    window.mapInitialized = true;
                }
            });
        },
        { threshold: 0.1 }
    );

    const mapSection = document.querySelector('#map-section');
    if (mapSection) mapSectionObserver.observe(mapSection);
});

// Création des sections HTML
function createSections(locations) {
    const container = d3.select(".map-sections-container");
    
    // Introduction
    container.append("div")
        .attr("class", "step")
        .attr("id", "step-intro")
        .attr("data-step", "-1")
        .html(`
        <div class="info-box intro">
            <h4>10 films inspirés par des lieux réels</h4>
            <p>Faites défiler pour explorer les lieux à travers le monde qui ont inspiré les films emblématiques du Studio Ghibli.</p>
            <p>Chaque lieu raconte une histoire unique qui a donné vie à ces mondes d'animation légendaires.</p>
        </div>
    `);

    // Sections pour chaque lieu
    locations.forEach((location, i) => {
        container.append("div")
            .attr("class", "step")
            .attr("id", `step-${i}`)
            .attr("data-step", i)
            .html(`
                <div class="info-box">
                    <img src="${location.image_film}" alt="${location.name}" class="film-image">
                    <img src="${location.image_reel}" alt="${location.name}" class="location-image">
                    <h4 class="location-name" style="border-color: ${location.color}">${location.name}</h4>
                    <div class="film-title">Film : ${location.film}</div>
                    <div class="country">Pays : ${location.country}</div>
                </div>
            `);
    });
}

// Initialisation de la carte
function initializeMap() {
    Promise.all([
        d3.json("https://d3js.org/world-110m.v1.json"),
        d3.json("/src/map/map-data.json")
    ]).then(([world, locations]) => {
        
        createSections(locations);
        
        // Dessin des pays
        const countries = topojson.feature(world, world.objects.countries);
        g.append("g")
            .selectAll("path")
            .data(countries.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "#e8e8e8")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);

        // Points d'intérêt
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
            .on("mouseover", function (event, d) {
                tooltip.style("opacity", 1)
                    .html(`<strong>${d.name}</strong><br>${d.film}`)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 30) + "px");

                d3.select(this).transition().duration(300).attr("r", 12);
            })
            .on("mouseout", function () {
                tooltip.style("opacity", 0);
                d3.select(this).transition().duration(300).attr("r", 8);
            });

        // Labels
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

        // Vue initiale
        const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(1);
        svg.call(zoom.transform, initialTransform);

        // Scrollama setup
        const scroller = scrollama()
            .setup({
                step: ".step",
                offset: 0.5,
                debug: false
            })
            .onStepEnter(handleStepEnter)
            .onStepExit(handleStepExit);

        function handleStepEnter(response) {
            const stepIndex = parseInt(response.element.getAttribute("data-step"));
            
            const infoBox = response.element.querySelector(".info-box");
            if (infoBox) infoBox.classList.add("active");
            
            if (stepIndex !== -1 && stepIndex !== currentLocationIndex) {
                currentLocationIndex = stepIndex;
                const location = locations[stepIndex];
                
                userScrolling = true;
                
                const [x, y] = projection(location.coords);
                const scale = 3;
                
                svg.transition()
                    .duration(1500)
                    .call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(width / 2 - x * scale, height / 2 - y * scale)
                            .scale(scale)
                    )
                    .on("end", () => { userScrolling = false; });
                
                points
                    .transition()
                    .duration(500)
                    .attr("r", d => d === location ? 10 : 5)
                    .attr("stroke-width", d => d === location ? 3 : 2);
            }
            else if (stepIndex === -1) {
                userScrolling = true;
                
                svg.transition()
                    .duration(1500)
                    .call(zoom.transform, initialTransform)
                    .on("end", () => { userScrolling = false; });
                
                points
                    .transition()
                    .duration(500)
                    .attr("r", 8)
                    .attr("stroke-width", 2);
                
                currentLocationIndex = -1;
            }
        }
        
        function handleStepExit(response) {
            const infoBox = response.element.querySelector(".info-box");
            if (infoBox) infoBox.classList.remove("active");
        }

        function handleResize() {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            
            svg.attr("width", newWidth).attr("height", newHeight);
            projection.translate([newWidth / 2, newHeight / 2]);
            
            g.selectAll("path").attr("d", path);
            g.selectAll("circle")
                .attr("cx", d => projection(d.coords)[0])
                .attr("cy", d => projection(d.coords)[1]);
            g.selectAll("text")
                .attr("x", d => projection(d.coords)[0])
                .attr("y", d => projection(d.coords)[1] - 15);
                
            scroller.resize();
        }
        
        window.addEventListener('resize', handleResize);
    });
}