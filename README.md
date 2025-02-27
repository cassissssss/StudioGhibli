# M52-1_VisualDon_StudioGhibli
 
**Contexte** : 
1. Kaggle - Données sur les films
Auteur.trice : Shruthi
Màj par : Priyanka Panga
Contexte : projet personnel d'analyse
Lien : https://www.kaggle.com/datasets/priyankapanga/studio-ghibli-films-dataset
 
2. GitHub - Données sur les genres, budgets
Auteur.trice : phelpsbp
Contexte : projet d'analyse de données
Lien : https://github.com/phelpsbp/Studio-Ghibli-Genre-Popularity-Analysis/blob/main/Studio%20Ghibli%20Genre%20Popularity.ipynb
 
3. Wiki Ghibli - encyclopédie sur le Studio
Auteur.trice : Communauté
Contexte : à titre informatif, pour se renseigner
Lien : https://ghibli.fandom.com/fr/wiki/Wiki_Studio_Ghibli
 
4. API - répertorie films, personnes, emplacement, espèces, véhicules
Auteur.trice : fan-made
Contexte : crée pour aider les utilisateurs.trices à découvrir des ressources
Liens :
- https://ghibliapi.vercel.app/
- https://ghibli.rest/docs/#/
 
5. Lieux qui ont inspirés le Studio - Base de données à créer
Auteur.trice : AMPLITUDES
Contexte : inspirations pour partir en voyage
Lien : https://www.amplitudes.com/blog/10-lieux-ayant-inspire-le-studio-ghibli-et-miyazaki/
 
6. Historique rapide sur le Studio Ghibli
Auteur.trice : wikipedia
Lien : https://fr.wikipedia.org/wiki/Studio_Ghibli
 
**Description** : 
1. Kaggle – Données sur les films
- Format : CSV
- Attributs :
title (str) → Titre du film
original_title (str) → Titre original en japonais
director (str) → Réalisateur
producer (str) → Producteur
release_date (int) → Année de sortie
running_time (int) → Durée en minutes
rt_score (int) → Score Rotten Tomatoes
description (str) → Résumé du film
- Type de données :
Chaîne de caractères (str) : Pour les noms, titres et descriptions
Entier (int) : Pour l’année, la durée et le score
 
2. GitHub – Analyse des genres et budgets
- Format : Jupyter Notebook (Python, CSV)
- Attributs (issus de l’analyse) :
title (str) → Nom du film
genre (str) → Genre principal du film
budget (int/float) → Budget du film (en yen ou dollars)
box_office (int/float) → Revenus générés
audience_score (int) → Score donné par le public
- Type de données :
Chaîne de caractères (str) : Pour les titres et genres
Numérique (int/float) : Pour les budgets et revenus
 
3. API Studio Ghibli (GhibliAPI et Ghibli.rest)
- Format : JSON
- Exemple de structure pour un film :
{
  "id": "2baf70d1-42bb-4437-b551-e5fed5a87abe",
  "title": "Le Château dans le ciel",
  "original_title": "天空の城ラピュタ",
  "description": "Un jeune garçon et une fille...",
  "director": "Hayao Miyazaki",
  "producer": "Isao Takahata",
  "release_date": "1986",
  "running_time": "124",
  "rt_score": "95"
}
- Type de données :
UUID (str) : Identifiant unique
Chaîne de caractères (str) : Pour les titres, descriptions, réalisateurs, producteurs
Entier (int) : Pour l’année, durée, et score
Autres catégories disponibles dans l’API :
Personnages (people/) : nom, âge, genre, affiliation
Lieux (locations/) : nom, climat, surface
Espèces (species/) : nom, classification
Véhicules (vehicles/) : modèle, pilote
 
4. Wiki Ghibli – Structure informelle
- Format : Texte structuré en HTML (wiki)
- Attributs (varient selon les pages) :
title → Nom du film, personnage ou lieu
summary → Résumé de l’œuvre ou du sujet
appearances → Liste des films où apparaît un personnage
background → Détails historiques et inspirations
- Type de données :
Texte structuré : Principalement en format HTML avec des liens hypertextes
 
5. Base de données des lieux inspirants (à créer)
- Format envisagé : CSV ou JSON
- Attributs possibles :
place_name (str) → Nom du lieu
country (str) → Pays où il se situe
film_reference (str) → Film inspiré par ce lieu
latitude / longitude (float) → Coordonnées GPS
- Type de données :
Texte (str) : Noms et films
Numérique (float) : Coordonnées géographiques
 
**But** :
Notre but est de faire découvrir l'univers du studio ghibli via le story scolling, avec la possibilité d'interagir
- Une chronologie des films qui permet d'en apprendre plus sur les films d'animation
- Carte interactive des lieux qui ont inspirés les différents films
- Quelques données plus précises, anecdotes par exemple la place des femmes dans les studio ghibli
- Types de personnages, genres des films,
- Musiques, images
- Ranking et budget
 
**Références** :
Le but des données créées est principalement pour les fans ou pour toutes personnes qui souhaitent en apprendre plus sur l'univers du Studio Ghibli. Elles sont également utilisées par différents acteurs du web et de la recherche, souvent pour des analyses culturelles, artistiques, économiques ou techniques. Par exemple IMDb (www.imdb.com) recense les films Ghibli avec détails sur le casting, le budget et les critiques.
Un autre exemple serait "The Anime Art of Hayao Miyazaki" de Dani Cavallaro, 2006, où il analyse l’impact des films sur la culture mondiale.
Finalement, on peut aussi retrouver ce type de contenu sur des plateformes tel que Youtube qui propose du contenu éducatif et divertissant sur le Studio.
