Un mod pour Fallout 4 (PC), encore au stade de la conception. Le point de départ : à la sortie de l'Abri 111, le joueur hérite d'une unité de trente synthétiques. Leur chef est piloté par une IA locale — sarcastique, bavard, il commente ce qu'il voit. Le joueur lui donne des ordres de haut niveau (« prends ce camp »), et c'est lui qui répartit ses vingt-neuf hommes : snipers en hauteur, diversion, gardes du corps, assaut par le flanc.

L'intérêt du projet est là : commander une escouade par l'intention plutôt que micro-gérer chaque personnage, avec un chef qui a de la personnalité.

### Ce qu'on y trouve
- La documentation de conception du mod : brief, design, architecture, veille technique et journal de décisions
- Un premier prototype, pas encore un mod jouable : le plugin du jeu est généré par du code, et un script fait apparaître le chef et ses vingt-neuf hommes avec des ordres de base au clavier (suivre, tenir la position, attaquer)

### Sous le capot
Prévu : plugin F4SE (C++ / CommonLibF4) · scripts Papyrus · « cerveau » en Python · IA locale (Ollama) · synthèse vocale

### Où en est la filiale
Le mod lui-même est encore en conception, mais les fondations techniques sont posées : le jeu tourne dans sa dernière version avec un premier PNJ qui converse en jeu, piloté par une IA locale et doublé par une voix de synthèse (via le mod Mantella, adapté pour cette version du jeu). Le prototype sans IA (faction dédiée, le chef et ses vingt-neuf hommes, ordres de base) est en cours de test en jeu, pour mesurer les performances avec autant de personnages à l'écran avant d'y brancher l'IA et la voix.
