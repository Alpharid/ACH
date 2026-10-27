Arx Sandbox fait revivre **Arx Fatalis à plusieurs** : la carte du jeu à l'identique, ses quêtes, ses dialogues et ses cinématiques, ses habitants, son combat et sa magie à runes, recréés dans Godot. Le joueur qui héberge la partie mène l'histoire, ses amis l'accompagnent dans le monde souterrain.

Un second mode, **bac à sable**, ouvre la même carte sans l'histoire, avec console et menu d'administration : c'est l'outil de mise en scène d'un maître de jeu dont la campagne de jeu de rôle fait suite au jeu d'origine.

Le projet ne contient que du code : chacun le fait tourner avec **sa propre copie** d'Arx Fatalis, dont les données sont converties sur sa machine et ne sont jamais publiées.

### Ce qu'on y trouve
- Tous les niveaux du jeu, à l'identique, avec leurs passages d'origine.
- Les scripts du jeu interprétés tels quels : quêtes, dialogues, cinématiques jouées pour tout le groupe.
- Le combat, la magie (runes tracées à la souris, 49 sorts), l'IA des habitants et les sauvegardes.
- L'interface du jeu : inventaire, livre, carte, journal des quêtes, bourse.
- Une coop où l'hôte mène l'histoire : exploration libre, scènes vues par tout le groupe, objets de quête partagés.
- Un multijoueur avec serveur autoritaire : on héberge depuis le jeu ou le lanceur, on partage un lien, les amis rejoignent ; chat vocal de proximité.
- Un lanceur Windows qui installe et met à jour la version choisie.

### Sous le capot
Godot 4.7 · GDScript et C# · Python (convertisseur des formats d'Arx) · WebSocket · lanceur Python empaqueté en exe

### Où en est la filiale
Alpha (0.6.0). Presque tout le jeu est porté, et l'hôte mène désormais l'histoire : chacun explore librement, les scènes rassemblent le groupe, les objets de quête comptent pour tous. Il reste à le valider en jouant l'histoire de bout en bout et en vraies parties entre plusieurs PC.
