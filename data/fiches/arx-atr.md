Arx : Tenebris Relectis est une campagne de jeu de rôle sur table jouée sur Roll20, qui prolonge l'univers du jeu vidéo Arx Fatalis. La filiale regroupe les outils maison qui équipent cette campagne : de quoi fabriquer les cartes des donjons, une fiche de personnage dédiée, et des planches d'objets et de décors pour le meneur.

Rien de ce qui appartient à Arx Fatalis n'est redistribué. Les cartes et les images se recalculent sur la machine du meneur, à partir de sa propre copie du jeu, et ne sont jamais versionnées : les dépôts ne contiennent que le code, les décisions et les gabarits. La fiche de personnage a été écrite par Chafik (dépôt d'origine public) ; l'Alpharium en maintient une version corrigée.

### Ce qu'on y trouve
- Un pipeline qui reconstruit les huit niveaux en cartes Roll20 (image, murs, portes, herses, fenêtres, lumières) à partir des fichiers du jeu.
- Un script de meneur qui pose au bon endroit les images d'objets, d'étages et de décors superposés.
- Une fiche de personnage complète : niveau, attributs, compétences, jauges de vie et de mana, résistances, postures.
- Un inventaire en grille, de l'équipement, un grimoire (apprentissage et combinaison de runes) et des sorts mémorisables.
- Une carte à déverrouiller niveau par niveau et des pages de notes pour le joueur.
- Trois jeux d'assets pour le meneur : icônes d'inventaire, décors, jetons de créatures et de PNJ.

### Sous le capot
Fiche Roll20 « legacy » en HTML/CSS et sheet-worker, assemblée par un build Jinja · pipeline de cartes en Python (format .dd2vtt) · script d'API Roll20 en JavaScript.

### Où en est la filiale
En cours. La fiche a reçu un audit et des corrections (octobre 2026) et attend la relecture de son auteur avant d'être figée ; le pipeline de cartes produit déjà les huit niveaux. Le tout sert une campagne réelle, menée sur Roll20.
