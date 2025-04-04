import * as d3 from 'd3';


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
    characters: [
        { name: "Chihiro", image: "chihiro.jpg", position: "top-left", size: "large", column: "left" },
        { name: "Kiki", image: "kiki.jpg", position: "top-left", size: "small", column: "left" },
        { name: "Nausicaä", image: "nausicaa.jpg", position: "top-left", size: "small", column: "left" },
        { name: "Arrietty", image: "arrietty.jpg", position: "bottom-right", size: "tall", column: "right" }
    ],
    quote: {
        text: "\"Beaucoup de mes films comportent des personnages féminins forts. Des filles courageuses et indépendantes, qui n'hésitent pas une seule seconde à se battre avec tout leur cœur pour les causes auxquelles elles croient. Elles auront peut-être besoin d'un ami, ou d'un soutien, mais en aucun cas d'un sauveur. Les femmes peuvent être aussi héroïques que les hommes.\"",
        author: "Hayao Miyazaki, The Guardian (2013)"
    },
    source: "A Content Analysis: Gender Roles in Studio Ghibli Films (Cho & Macomber, 2022)"
};

const colors = {
    primary: "#ca9ea9",
    secondary: "#778c82"
};

const IMG_PATH = "anecdotes-img/";

function createElement(type, className, textContent = "", attributes = {}) {
    const element = document.createElement(type);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    
    Object.entries(attributes).forEach(([attr, value]) => {
        element.setAttribute(attr, value);
    });
    
    return element;
}

function createCharacterCard(character) {
    const { name, image, position, size, column } = character;
    const cardClass = `anecdotes-character-card anecdotes-character-card--${size}`;
    const nameClass = `anecdotes-character-card__name anecdotes-character-card__name--${position}`;
    
    const card = createElement('div', cardClass);
    const img = createElement('img', '', '', {
        src: `${IMG_PATH}${image}`,
        alt: name
    });
    const nameDiv = createElement('div', nameClass, name);
    
    card.appendChild(img);
    card.appendChild(nameDiv);
    
    return card;
}

function createAnecdotesSection() {
    const layoutDiv = createElement('div', 'anecdotes-layout');
    
    const header = createElement('header', 'anecdotes__header');
    const title = createElement('h1', 'anecdotes__title', 'Anecdotes');
    const subtitle = createElement('h3', 'anecdotes__subtitle', 'La représentation des femmes chez Ghibli');
    
    header.appendChild(title);
    header.appendChild(subtitle);
    layoutDiv.appendChild(header);
    
    const charactersSection = createElement('section', 'anecdotes-characters');
    
    const leftCharacters = data.characters.filter(char => char.column === 'left');
    const rightCharacters = data.characters.filter(char => char.column === 'right');
    
    const leftColumn = createElement('div', 'anecdotes-characters__column anecdotes-characters__column--left');
    
    const largeCard = leftCharacters.find(char => char.size === 'large');
    if (largeCard) {
        leftColumn.appendChild(createCharacterCard(largeCard));
    }
    
    const smallCards = leftCharacters.filter(char => char.size === 'small');
    if (smallCards.length > 0) {
        const thumbnails = createElement('div', 'anecdotes-character-card__thumbnails');
        smallCards.forEach(card => thumbnails.appendChild(createCharacterCard(card)));
        leftColumn.appendChild(thumbnails);
    }
    
    const rightColumn = createElement('div', 'anecdotes-characters__column anecdotes-characters__column--right');
    
    const tallCard = rightCharacters.find(char => char.size === 'tall');
    if (tallCard) {
        rightColumn.appendChild(createCharacterCard(tallCard));
    }
    
    charactersSection.appendChild(leftColumn);
    charactersSection.appendChild(rightColumn);
    layoutDiv.appendChild(charactersSection);
    
    const quoteSection = createElement('section', 'quote');
    const blockquote = createElement('blockquote', 'quote__text', data.quote.text);
    const cite = createElement('cite', 'quote__author', data.quote.author);
    
    quoteSection.appendChild(blockquote);
    quoteSection.appendChild(cite);
    layoutDiv.appendChild(quoteSection);
    
    // Create stats section
    const statsSection = createElement('section', 'stats');
    const statsGrid = createElement('div', 'stats__grid');
    
    ['male', 'female'].forEach(gender => {
        const genderData = data.protagonists[gender];
        const genderTranslated = gender === 'male' ? 'masculins' : 'féminins';
        
        const card = createElement('article', 'stats__card');
        const title = createElement('h3', 'stats__title', `Personnages ${genderTranslated}`);
        const chart = createElement('div', 'stats__chart', '', { id: `chart-${gender}-traits` });
        
        const traits = createElement('div', 'stats__traits');
        const traitsTitle = createElement('h4', 'stats__traits-title', 'Traits principaux');
        const traitsList = createElement('ul', 'stats__traits-list', '', { id: `list-${gender}-top-traits` });
        
        traits.appendChild(traitsTitle);
        traits.appendChild(traitsList);
        
        const rescue = createElement('div', 'stats__rescue');
        
        const rescueBox1 = createElement('div', 'rescue-box');
        const rescueValue1 = createElement('div', 'rescue-box__value', '', { id: `stat-${gender}-rescues` });
        const rescueLabel1 = createElement('div', 'rescue-box__label', 'Sauvetages effectués');
        
        rescueBox1.appendChild(rescueValue1);
        rescueBox1.appendChild(rescueLabel1);
        
        const rescueBox2 = createElement('div', 'rescue-box');
        const rescueValue2 = createElement('div', 'rescue-box__value', '', { id: `stat-${gender}-rescued` });
        const rescueLabel2 = createElement('div', 'rescue-box__label', `Fois secour${gender === 'male' ? 'us' : 'ues'}`);
        
        rescueBox2.appendChild(rescueValue2);
        rescueBox2.appendChild(rescueLabel2);
        
        rescue.appendChild(rescueBox1);
        rescue.appendChild(rescueBox2);
        
        card.appendChild(title);
        card.appendChild(chart);
        card.appendChild(traits);
        card.appendChild(rescue);
        
        statsGrid.appendChild(card);
    });
    
    const statsFooter = createElement('footer', 'stats__source', '', { id: 'data-source' });
    
    statsSection.appendChild(statsGrid);
    statsSection.appendChild(statsFooter);
    layoutDiv.appendChild(statsSection);

    const comparisonChart = createComparisonChart();
    layoutDiv.appendChild(comparisonChart);
    
    
    return layoutDiv;
}

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
        .style("font-size", "10px")
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
// function createGenderComparisonChart() {
//     // Données pour la comparaison des genres
//     const comparisonData = [
//         { studio: "Disney", female: 37},
//         { studio: "Ghibli", female: 65}
//     ];
    
//     // Sélectionner le conteneur existant et vider son contenu
//     const container = d3.select("#gender-comparison-root");
//     container.html("");
    
//     const margin = { top: 30, right: 30, bottom: 70, left: 60 },
//         width = 600 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;
    
//     // Créer le SVG
//     const svg = container
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);
    
//     // Échelles X et Y
//     const x = d3.scaleBand()
//         .range([0, width])
//         .domain(comparisonData.map(d => d.studio))
//         .padding(0.4); // Augmenter le padding pour des barres plus fines
    
//     const y = d3.scaleLinear()
//         .domain([0, 100])
//         .range([height, 0]);
    

  
    
//     // Créer les barres pour les pourcentages féminins
//     svg.selectAll(".bar-female")
//         .data(comparisonData)
//         .enter()
//         .append("rect")
//         .attr("class", "bar-female")
//         .attr("x", d => x(d.studio))
//         .attr("y", d => y(d.female))
//         .attr("width", x.bandwidth())
//         .attr("height", d => height - y(d.female))
//         .attr("fill", colors.primary)
//         .attr("rx", 4)
//         .attr("ry", 4);
    
//     // Ajouter les étiquettes de pourcentage féminin
//     svg.selectAll(".label-female")
//         .data(comparisonData)
//         .enter()
//         .append("text")
//         .attr("class", "label-female")
//         .attr("x", d => x(d.studio) + x.bandwidth() / 2)
//         .attr("y", d => y(d.female) - 10)
//         .attr("text-anchor", "middle")
//         .attr("font-size", "16px")
//         .attr("font-weight", "bold")
//         .attr("fill", colors.primary)
//         .text(d => d.female + "%");
    
    
    
//     // Ajouter une étiquette pour la ligne de référence
//     svg.append("text")
//         .attr("x", width + 10)
//         .attr("y", y(50) + 5)
//         .attr("text-anchor", "start")
//         .attr("font-size", "12px")
//         .text("50% - Parité");
    
//     // Ajouter un titre pour le graphique
//     svg.append("text")
//         .attr("x", width / 2)
//         .attr("y", -10)
//         .attr("text-anchor", "middle")
//         .attr("font-size", "18px")
//         .attr("font-weight", "bold")
//         .text("Représentation féminine");

        
// }
document.addEventListener("DOMContentLoaded", () => {
    const anecdotesContainer = document.querySelector(".anecdotes-container");
    const anecdotesContent = createAnecdotesSection();
    
    anecdotesContainer.innerHTML = '';
    anecdotesContainer.appendChild(anecdotesContent);
    
    
    // Create the charts
    createDonutChart("#chart-male-traits", data.protagonists.male.traits, [colors.secondary, colors.primary]);
    createDonutChart("#chart-female-traits", data.protagonists.female.traits, [colors.secondary, colors.primary]);

    createComparisonChart();

    ['male', 'female'].forEach(gender => {
        const traitsList = document.getElementById(`list-${gender}-top-traits`);
        data.protagonists[gender].top_traits.forEach(trait => {
            const li = createElement('li', '', trait);
            traitsList.appendChild(li);
        });
        
        document.getElementById(`stat-${gender}-rescues`).textContent = data.protagonists[gender].rescues;
        document.getElementById(`stat-${gender}-rescued`).textContent = data.protagonists[gender].rescued;
    });

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


function createComparisonChart() {
    const section = createElement('section', 'comparison-section');

    const title = createElement('h3', 'comparison-title', 
        'Pourcentage de personnages féminins dans les films Disney vs Studio Ghibli');
    
    const container = createElement('div', 'comparison-container');

    const dataStudios = [
        { studio: 'Disney', percentage: 30, logo: 'comparaisons-img/disney_logo.png' },
        { studio: 'Studio Ghibli', percentage: 65, logo: 'comparaisons-img/studioghibli_logo.png' }
    ];

    dataStudios.forEach(({ studio, percentage, logo }) => {
        const card = createElement('div', 'comparison-card');

        const bar = createElement('div', 'comparison-bar');
        bar.style.height = (percentage / 100 * 250) + 'px';
        bar.textContent = `${percentage}%`;

        const logoImg = createElement('img', 'comparison-logo', '', {
            src: logo,
            alt: studio
        });

        card.appendChild(bar);
        card.appendChild(logoImg);
        container.appendChild(card);
    });

    const source = createElement('div', 'comparison-source',
        'Source : "A Content Analysis: Gender Roles in Studio Ghibli Films (2022)"');

    section.appendChild(title);
    section.appendChild(container);
    section.appendChild(source);

    return section;
}
