MM2 Web fait tourner **Midtown Madness 2**, le jeu de course urbaine d'Angel Studios sorti en 2000, directement dans un navigateur. Ce n'est pas un remake : c'est le jeu d'origine, avec les fichiers de son CD, qui démarre sur un PC d'aujourd'hui sans rien installer. La filiale est née d'un cadeau : permettre à un joueur de toujours de retrouver un de ses jeux préférés depuis chez lui, en un clic.

Le moteur est OpenMM2, une réimplémentation libre du jeu qui lit ses données d'origine. MM2 Web l'adapte au navigateur : rendu, son, boucle de jeu et sauvegardes.

### Ce qu'on y trouve
- Londres et San Francisco, avec le trafic, la police, les piétons et les dégâts.
- Tous les modes solo : Croisière, Blitz, Checkpoint, Circuit, Crash Course et Course immédiate.
- La musique et les voix d'origine.
- Les pilotes, réglages et records gardés dans le navigateur.
- Le clavier ou une manette.

### Sous le capot
C++23 · Emscripten (WebAssembly) · WebGL 2 · SDL3 · IndexedDB · Cloudflare Pages

### Où en est la filiale
En bêta, en ligne depuis le 27 octobre 2026 (lien réservé à la famille) : le jeu tourne à pleine vitesse dans Chrome et Edge, se télécharge une fois puis démarre en une seconde. Firefox, les manettes et le Crash Course restent à tester. Le multijoueur d'origine reste hors de portée, faute de réseau UDP dans un navigateur. Les données du jeu ne sont pas publiques : la filiale sert un cercle familial.
