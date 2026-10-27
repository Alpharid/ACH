La maquette Three.js est la toute première version de l'Alpharium : un lounge 3D dans le navigateur, avec son propre serveur, qu'un membre de la famille lance d'un double-clic pour ouvrir le club aux autres. On entre de nuit par la grande porte, Alphred le majordome souhaite la bienvenue, on choisit son personnage et on rejoint le salon : scène centrale, lustre, piste de danse, bar, coin karaoké.

C'est la maquette d'origine, celle où la carte est complète. Elle marchait, mais ramait sur les petits appareils : elle a donc été réécrite deux fois, en 3D sous Godot (le Luxurious Lounge), puis en 2D isométrique (le Kaddour Social Club, la version en service). Elle reste la référence : la carte, les mini-jeux et beaucoup d'idées des deux suivantes viennent d'ici.

### Ce qu'on y trouve
- L'entrée de nuit, la création de personnage et la personnalisation de l'avatar.
- Le tchat écrit et vocal, les émotes et les danses, un mode photo libre.
- Les jeux de table, le casino en jetons (machines, pachinko, blackjack), le Loup-Garou et un jeu de cartes maison.
- Les soirées à thème du jour (karaoké, etc.) avec bonus d'expérience, les succès, le classement et le Panthéon du club.
- La vie du club : inventaire, amis, invitations, élection de l'Alpha, appartements, et des outils de modération pour le staff.

### Sous le capot
Node.js (HTTP + WebSocket, sans framework) · client Three.js embarqué, modules JS · vocal en WebRTC · lanceur Windows qui télécharge Node et ouvre un lien public temporaire.

### Où en est la filiale
Figée : jouable, mais plus développée. Elle sert de modèle au chantier du Luxurious Lounge, qui doit retrouver son ambiance.
