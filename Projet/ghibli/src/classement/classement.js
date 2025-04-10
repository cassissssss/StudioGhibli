import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

fetch("/films.json")
  .then(res => res.json())
  .then(data => {
    const films = data.sort((a, b) => b.rating - a.rating);

    const margin = { top: 100, right: 30, bottom: 100, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;


    const svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(films.map(d => d.name))
      .range([0, width])
      .padding(0.25);

    const y = d3.scaleLog()
      .domain([5e5, 5e8])
      .range([height, 0])
      .base(10);

    svg.selectAll("rect")
      .data(films)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => {
        const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
        return y(revenue);
      })
      .attr("width", x.bandwidth())
      .attr("height", d => {
        const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
        return y(5e5) - y(revenue);
      })
      .attr("fill", "#ca9ea9")
      .attr("rx", 8);

    // Fonction pour diviser le texte en plusieurs lignes
    function wrapTextInRect(text, width) {
      const words = text.split(/\s+/);
      if (words.length <= 1) return [text]; // Si un seul mot, pas besoin de wrap
      
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + " " + words[i];
        // Estimation de la longueur de texte (ajustez selon votre police)
        // En réalité, on devrait mesurer, mais c'est une approximation
        if (testLine.length * 6 > width) { // 7 pixels par caractère est une estimation
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
      return lines;
    }

   // Ajout des étiquettes des films avec support multi-lignes
svg.selectAll(".film-label-group")
.data(films)
.enter()
.append("g")
.attr("class", "film-label-group")
.attr("transform", d => {
  const xPos = x(d.name) + x.bandwidth() / 2;
  // Position constante en partant du bas de la barre
  const yPos = y(5e5) - 10; // Position fixe pour tous les films
  return `translate(${xPos}, ${yPos}) rotate(-90)`;
})
.each(function(d) {
  const g = d3.select(this);
  const barHeight = y(5e5) - y(parseFloat(d.revenue.replace(/\$/g, '')));
  const lines = wrapTextInRect(d.name, barHeight * 0.8); // 80% de la hauteur de la barre
  
  lines.forEach((line, i) => {
    g.append("text")
      .text(line)
      .attr("x", 0)
      .attr("y", i * 15) // Espacement entre les lignes
      .attr("text-anchor", "start") // Changement de "middle" à "start" pour aligner au début
      .style("fill", "#fff")
      .style("font-size", "14px")
      .style("font-family", "Montserrat")
      .style("font-weight", "500");
  });
});
    svg.selectAll(".top-label")
      .data(films) // Top 3
      .enter()
      .append("text")
      .text((d, i) => `${i + 1}`) // 1, 2, 3
      .attr("x", d => x(d.name) + x.bandwidth() / 2-20)
      .attr("y", d => y(parseFloat(d.revenue.replace(/\$/g, ''))) - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "60px")
      .style("font-family", "scale-variable")
      .style("fill", "#333")
      .style("font-weight", "900")
      .style("opacity", 0.2);

      svg.selectAll(".film-icon")
      .data(films) // Top 3
      .enter()
      .append("image")
      .attr("class", "film-icon")
      .attr("xlink:href", d => d.icon)
      .attr("x", d => x(d.name) + x.bandwidth() / 2 -50) // Centrer l'icône, -20 pour décaler de la moitié de sa largeur
      .attr("y", d => y(parseFloat(d.revenue.replace(/\$/g, ''))) - 110) // Positionner au-dessus du numéro
      .attr("width", 130)
      .attr("height", 130)
      .style("filter", "drop-shadow(0px 0px 3px rgba(0,0,0,0.3))"); // Ajouter une ombre subtile
    
    svg.selectAll(".revenue-label")
      .data(films)
      .enter()
      .append("text")
      .text(d => `$${(parseFloat(d.revenue.replace(/\$/g, '')) / 1e6).toFixed(1)}M`)
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(5e5) + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#9C6173")
      .style("font-weight", "700");

      const infoColor = "#9C6173";

      svg.append("line")
      .attr("x1", margin.left-80)
      .attr("y1", margin.top-500)
      .attr("x2", margin.left-80)
      .attr("y2", margin.top + height -50) // un petit dépassement
      .attr("stroke", `${infoColor}`)
      .attr("opacity", 0.1)
      .attr("stroke-width", 3)


    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(-50, ${margin.top + 250}) rotate(-90)`)
      .text("Revenus des films ($)")
      .style("font-size", "14px")
      .style("fill",  `${infoColor}`)
      .style("font-weight", "bold");

    svg.append("line")
      .attr("x1", margin.left-80)
      .attr("y1", margin.top + height-50)
      .attr("x2", margin.left + width + 10)
      .attr("y2", margin.top + height-50)
      .attr("stroke", `${infoColor}`)
      .attr("opacity", 0.1)
      .attr("stroke-width", 3)


    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", margin.left + width / 2)
      .attr("y", height + 80)
      .text("Du mieux noté au moins bien noté")
      .style("font-size", "14px")
      .style("fill",  `${infoColor}`)
      .style("font-weight", "bold");
  });