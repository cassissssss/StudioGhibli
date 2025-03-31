// Data provided in JSON format
const data = {
    "studio": "Ghibli",
    "protagonists": {
        "male": {
            "traits": {
                "masculine": 62.65,
                "feminine": 37.35
            },
            "top_traits": [
                "Athletic",
                "Shows emotion",
                "Assertive",
                "Physically strong",
                "Unemotional"
            ],
            "rescues": 4,
            "rescued": 6
        },
        "female": {
            "traits": {
                "masculine": 48.58,
                "feminine": 51.42
            },
            "top_traits": [
                "Shows emotion",
                "Athletic",
                "Assertive",
                "Affectionate",
                "Unemotional"
            ],
            "rescues": 11,
            "rescued": 4
        }
    },
    "source": "A Content Analysis: Gender Roles in Studio Ghibli Films (Cho & Macomber, 2022)"
};

// Définir les nouvelles couleurs inspirées des personnages
const colors = {
    primary: "#ca9ea9",    // Rose pâle (inspiré des tons de Chihiro)
    secondary: "#778c82",  // Vert-gris (inspiré des tons de Nausicaä)
};

// Function to create donut charts
function createDonutChart(selector, data, colors) {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + 150) // Augmenter la largeur pour la légende
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    // Convert data to the format required by d3.pie
    const pieData = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value
    }));

    // Create the donut segments
    const path = svg.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colors[i])
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // Add labels
    const arcLabel = d3.arc()
        .innerRadius(radius * 0.8)
        .outerRadius(radius * 0.8);

    svg.selectAll("text")
        .data(pie(pieData))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(d => `${d.data.value.toFixed(1)}%`)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "white");

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(pieData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${radius + 20}, ${i * 20 - 20})`); // Nouvelle position

    legend.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (d, i) => colors[i]);

    legend.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text(d => `Traits ${d.name === "masculine" ? "masculins" : "féminins"}`)
        .style("font-size", "12px");
}

// Initialize the page when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Display male data avec les nouvelles couleurs
    createDonutChart("#male-chart", data.protagonists.male.traits, [colors.secondary, colors.primary]);

    // Display female data avec les nouvelles couleurs
    createDonutChart("#female-chart", data.protagonists.female.traits, [colors.secondary, colors.primary]);

    // Fill in the traits lists
    const maleTraitsList = document.getElementById("male-traits-list");
    data.protagonists.male.top_traits.forEach(trait => {
        const li = document.createElement("li");
        li.textContent = trait;
        maleTraitsList.appendChild(li);
    });

    const femaleTraitsList = document.getElementById("female-traits-list");
    data.protagonists.female.top_traits.forEach(trait => {
        const li = document.createElement("li");
        li.textContent = trait;
        femaleTraitsList.appendChild(li);
    });

    // Fill in the rescue stats
    document.getElementById("male-rescues").textContent = data.protagonists.male.rescues;
    document.getElementById("male-rescued").textContent = data.protagonists.male.rescued;
    document.getElementById("female-rescues").textContent = data.protagonists.female.rescues;
    document.getElementById("female-rescued").textContent = data.protagonists.female.rescued;

    // Fill in the source citation
    document.getElementById("source-citation").textContent = data.source;
});

// Mettre à jour les styles CSS pour les éléments complémentaires
const style = document.createElement('style');
style.textContent = `
    .traits-list li:before {
        color: ${colors.primary} !important;
    }
    .rescue-number {
        color: ${colors.secondary} !important;
    }
`;
document.head.appendChild(style);