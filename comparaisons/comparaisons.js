const maxHeight = 250;

const data = [
    { studio: 'Disney', percentage: 30, logo: 'img/disney_logo.png' },
    { studio: 'Studio Ghibli', percentage: 65, logo: 'img/studioghibli_logo.png' }
];

const root = document.getElementById('gender-comparison-root');

function createChart(studio, percentage, logoPath) {
    const chart = document.createElement('div');
    chart.className = 'gender-comparison-chart';

    const percent = document.createElement('div');
    percent.className = 'gender-comparison-percentage';
    percent.textContent = `${percentage}%`;

    const bar = document.createElement('div');
    bar.className = 'gender-comparison-bar';
    bar.style.height = (percentage / 100) * maxHeight + 'px';

    const logo = document.createElement('img');
    logo.className = 'gender-comparison-logo';
    logo.src = logoPath;
    logo.alt = studio;

    chart.appendChild(percent);
    chart.appendChild(bar);
    chart.appendChild(logo);

    return chart;
}

// Générer les barres dynamiquement
for (const d of data) {
    const element = createChart(d.studio, d.percentage, d.logo);
    root.appendChild(element);
}