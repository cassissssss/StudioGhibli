import './style.css'


// Navigation vers le bas
document.getElementById("skipToMap").addEventListener("click", () => {
  document.querySelector("#map-section").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("skipToCharacters").addEventListener("click", () => {
  document.querySelector("#characters-section").scrollIntoView({ behavior: "smooth" });
});


// Navigation vers le haut
document.getElementById("backToHistorique").addEventListener("click", () => {
  document.querySelector("#historique-section").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("backToMap").addEventListener("click", () => {
  document.querySelector("#map-section").scrollIntoView({ behavior: "smooth" });
});

