import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

fetch("/films.json")
  .then(res => res.json())
  .then(data => {
    const films = data.sort((a, b) => b.rating - a.rating);

    const margin = { top: 40, right: 30, bottom: 60, left: 60 },
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

    const y = d3.scaleLinear()
      .domain([0, d3.max(films, d => parseFloat(d.revenue.replace(/\$/g, '')))])
      .range([height, 0])
      .nice();

    svg.selectAll("rect")
      .data(films)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(parseFloat(d.revenue.replace(/\$/g, ''))))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(parseFloat(d.revenue.replace(/\$/g, ''))))
      .attr("fill", "#ca9ea9")
      .attr("rx", 8)
      .append("title") 
      .text(d => `${d.name} — Rating : ${d.rating} — Revenu : $${parseInt(d.revenue.replace(/\$/g, '')).toLocaleString()}`);

    svg.selectAll(".film-label")
      .data(films)
      .enter()
      .append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => {
        const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
        const barHeight = height - y(revenue);
        return barHeight > 60 ? y(revenue) + barHeight / 2 + 6 : height + 15;
      })
      .attr("transform", d => {
        const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
        const barHeight = height - y(revenue);
        return barHeight > 60
          ? `rotate(-90, ${x(d.name) + x.bandwidth() / 2}, ${y(revenue) + barHeight / 2 + 6})`
          : null;
      })
      .style("fill", d => {
        const revenue = parseFloat(d.revenue.replace(/\$/g, ''));
        return height - y(revenue) > 60 ? "#fff" : "#333";
      })
      .style("font-size", "12px")
      .style("font-weight", "600");

    svg.selectAll(".revenue-label")
      .data(films)
      .enter()
      .append("text")
      .text(d => `$${(parseFloat(d.revenue.replace(/\$/g, '')) / 1e6).toFixed(1)}M`)
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(parseFloat(d.revenue.replace(/\$/g, ''))) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333");
  });
