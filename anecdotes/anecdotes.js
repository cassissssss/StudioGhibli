const data = {
    studio: "Ghibli",
    protagonists: {
        male: {
            traits: {
                masculine: 62.65,
                feminine: 37.35
            },
            top_traits: ["Athlétique", "Exprime ses émotions", "Affirmé", "Physiquement fort", "Peu émotif"],
            rescues: 4,
            rescued: 6
        },
        female: {
            traits: {
                masculine: 48.58,
                feminine: 51.42
            },
            top_traits: ["Exprime ses émotions", "Athlétique", "Affirmée", "Affectueuse", "Peu émotive"],
            rescues: 11,
            rescued: 4
        }
    },
    source: "A Content Analysis: Gender Roles in Studio Ghibli Films (Cho & Macomber, 2022)"
};

const colors = {
    primary: "#ca9ea9",
    secondary: "#778c82"
};

function createDonutChart(selector, data, colors) {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + 150)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius);
    const arcLabel = d3.arc().innerRadius(radius * 0.8).outerRadius(radius * 0.8);

    const pieData = Object.entries(data).map(([key, value]) => ({ name: key, value }));

    svg.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colors[i])
        .attr("stroke", "white")
        .attr("stroke-width", 2);

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

    const legend = svg.selectAll(".legend")
        .data(pieData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${radius + 20}, ${i * 20 - 20})`);

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

document.addEventListener("DOMContentLoaded", () => {
    createDonutChart("#chart-male-traits", data.protagonists.male.traits, [colors.secondary, colors.primary]);
    createDonutChart("#chart-female-traits", data.protagonists.female.traits, [colors.secondary, colors.primary]);

    data.protagonists.male.top_traits.forEach(trait => {
        const li = document.createElement("li");
        li.textContent = trait;
        document.getElementById("list-male-top-traits").appendChild(li);
    });

    data.protagonists.female.top_traits.forEach(trait => {
        const li = document.createElement("li");
        li.textContent = trait;
        document.getElementById("list-female-top-traits").appendChild(li);
    });

    document.getElementById("stat-male-rescues").textContent = data.protagonists.male.rescues;
    document.getElementById("stat-male-rescued").textContent = data.protagonists.male.rescued;
    document.getElementById("stat-female-rescues").textContent = data.protagonists.female.rescues;
    document.getElementById("stat-female-rescued").textContent = data.protagonists.female.rescued;

    document.getElementById("data-source").textContent = data.source;

    const style = document.createElement("style");
    style.textContent = `
    .stats__traits-list li::before {
      color: ${colors.primary} !important;
    }
    .rescue-box__value {
      color: ${colors.secondary} !important;
    }
  `;
    document.head.appendChild(style);
});
