Arx Sandbox réunit les **huit niveaux d'Arx Fatalis** en un seul monde continu, sans écran de chargement, que l'on parcourt à plusieurs. C'est un outil de mise en scène pour un maître de jeu dont la campagne de jeu de rôle fait suite au jeu d'origine : les joueurs se retrouvent dans les lieux qu'ils connaissent, et le MJ peut les déplacer, les réorganiser et y jouer ses scènes.

Ce n'est pas un remake. Le projet ne contient que du code : chacun le fait tourner avec **sa propre copie** d'Arx Fatalis, dont les données sont converties sur sa machine et ne sont jamais publiées. L'IA, les quêtes et les scripts du jeu ne sont pas reproduits.

### Ce qu'on y trouve
- Les huit étages empilés sans chevauchement et reliés par un grand conduit d'aération central, avec un ascenseur à huit arrêts.
- Les PNJ, objets et sons d'origine, ainsi que l'interface du jeu : inventaire, livre, sorts, carte, journal.
- Un mode solo et un multijoueur avec serveur autoritaire : on héberge depuis le jeu ou le lanceur, on partage un lien, les amis rejoignent.
- Une console et un menu d'administration (téléportation, droits des invités, état du serveur).
- Un monde éditable dans l'éditeur Godot, et un lanceur Windows qui installe et met à jour la version choisie.

### Sous le capot
Godot 4.7 · GDScript · Python (convertisseur des formats d'Arx) · WebSocket · lanceur Python empaqueté en exe

### Où en est la filiale
Alpha (0.4.0). Le monde, le multijoueur et le lanceur fonctionnent ; les couloirs générés entre les niveaux sont encore en chantier et c'est la priorité. Le combat et la magie fidèles au jeu sont prévus ensuite.
