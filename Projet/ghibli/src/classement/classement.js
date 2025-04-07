import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

fetch("/films.json")
  .then(res => res.json())
  .then(data => {
    const films = data.sort((a, b) => b.rating - a.rating);

    const margin = { top: 100, right: 30, bottom: 300, left: 60 },
          width = 1000 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background-color", "#fffaf0")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);



    const x = d3.scaleBand()
      .domain(films.map(d => d.name))
      .range([0, width])
      .padding(0.25);

      const revenues = films.map(d => parseFloat(d.revenue.replace(/\$/g, '')));
      const minRevenue = d3.min(revenues);
      const maxRevenue = d3.max(revenues);
      
      const y = d3.scaleLog()
      .domain([d3.min(revenues.filter(d => d > 0)), maxRevenue])
      .range([height, 0])
      .base(10);
    
      
        const bars = svg.selectAll("rect")
        .data(films)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(parseFloat(d.revenue.replace(/\$/g, ''))))
        .attr("width", x.bandwidth())
        .attr("height", d => 300+height - y(parseFloat(d.revenue.replace(/\$/g, ''))))
        .attr("fill", "#ca9ea9")
        .attr("rx", 8);
      
      bars.append("title")
        .text(d => `${d.name} — Rating : ${d.rating} — Revenu : $${parseInt(d.revenue.replace(/\$/g, '')).toLocaleString()}`);
        svg.selectAll(".film-label")
  .data(films)
  .enter()
  .append("text")
  .text(d => d.name)
  .attr("text-anchor", "start")
  .attr("x", d => x(d.name) + x.bandwidth() / 2)
  .attr("y", d => {
    const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
    const barY = y(revenue);
    const barHeight = 300 + height - barY; // même formule que les rectangles
    const barBottom = height - barHeight; // base Y du rectangle
    return barBottom + barHeight - 5; // position tout en bas du rectangle
  })
  .attr("transform", d => {
    const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
    const barY = y(revenue);
    const barHeight = 300 + height - barY;
    const barBottom = height - barHeight;
    const xPos = x(d.name) + x.bandwidth() / 2;
    const yPos = barBottom + barHeight - 5;
    return `rotate(-90, ${xPos}, ${yPos})`;
  })
  .style("fill", "#fff")
  .style("font-size", "11px")
  .style("font-weight", "600");

      svg.selectAll(".top-label")
  .data(films.slice(0, 3)) // Top 3
  .enter()
  .append("text")
  .text((d, i) => `${i + 1}`) // 1, 2, 3
  .attr("x", d => x(d.name) + x.bandwidth() / 2)
  .attr("y", d => y(parseFloat(d.revenue.replace(/\$/g, ''))) - 20)
  .attr("text-anchor", "middle")
  .style("font-size", "36px")
  .style("font-family", "scale-variable")
  .style("fill", "#333")
  .style("font-weight", "900")
  .style("opacity", 0.2);

    
      svg.selectAll(".revenue-label")
      .data(films)
      .enter()
      .append("text")
      .text(d => `$${(parseFloat(d.revenue.replace(/\$/g, '')) / 1e6).toFixed(1)}M`)
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => {
        const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
        return y(revenue) + (height - y(revenue)) / 2 + 15; // vertical center
      })
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#fff")
   
    
  });
