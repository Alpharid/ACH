Arx : Tenebris Relectis est une campagne de jeu de rôle sur table jouée sur Roll20, qui prolonge l'univers du jeu vidéo Arx Fatalis. La filiale regroupe tout ce qui équipe cette campagne : les cartes des donjons, une fiche de personnage dédiée, des planches d'objets et de décors, une régie sonore et un installateur qui monte la partie Roll20 pas à pas.

Rien de ce qui appartient à Arx Fatalis n'est redistribué. Les cartes, les images et les sons se recalculent sur la machine du meneur, à partir de sa propre copie du jeu, et ne sont jamais versionnés : les dépôts ne contiennent que le code, les décisions et les gabarits.

### Ce qu'on y trouve
- Un pipeline qui reconstruit les huit niveaux en cartes Roll20 (image, murs, portes, herses, fenêtres, lumières) à partir des fichiers du jeu.
- Un script de meneur qui pose au bon endroit les images d'objets, d'étages et de décors superposés.
- Une fiche de personnage complète : niveau, attributs, compétences, jauges de vie et de mana, résistances, postures, inventaire en grille, équipement, grimoire de runes et sorts mémorisables.
- Une carte à déverrouiller niveau par niveau et des pages de notes pour le joueur.
- Trois jeux d'assets pour le meneur : icônes d'inventaire, décors, jetons de créatures et de PNJ.
- Une régie sonore : ambiances en boucle, bruitages, cris de créatures, voix et musiques, rangées pour être jouées depuis un pupitre tactile.
- Un « QG du meneur » et un installateur de campagne, avec un tutoriel Roll20 de A à Z généré automatiquement.

### Sous le capot
Fiche Roll20 « legacy » en HTML/CSS et sheet-worker, assemblée par un build Jinja · pipeline de cartes en Python (format .dd2vtt) · script d'API Roll20 en JavaScript · extraction des sons en Python.

### Où en est la filiale
En production : les huit cartes sont validées, la fiche est auditée et corrigée, et la campagne est prête à être jouée sur Roll20.
