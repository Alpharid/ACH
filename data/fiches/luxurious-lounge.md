Le Luxurious Lounge est l'Alpharium rêvé en grand : un gratte-ciel de luxe en 3D où la famille se retrouve le soir, jouable directement dans le navigateur, sur PC comme sur téléphone. On arrive de nuit devant la façade, le portier accueille, puis le lobby de marbre mène au grand ascenseur de verre, au lounge du penthouse, au casino caché et au rooftop. Ambiance : marine, or et velours, 100 % chill.

C'est le deuxième essai de l'Alpharium. La maquette Three.js avait l'âme, mais ramait sur les petits appareils ; cette version reprend tout sous Godot, plus robuste, avec un serveur qui décide de tout.

### Ce qu'on y trouve
- Une carte construite entièrement par le code : façade, lobby, ascenseur, penthouse, casino, rooftop.
- Un avatar 3D personnalisable, vue à la troisième ou à la première personne, joystick et gestes sur téléphone.
- Des PNJ : le majordome, le portier, les croupiers.
- Des jeux de table : morpion, puissance 4, dés menteurs, Flip Seven, Wavelength, quiz de la famille, Loup-Garou, et un jeu de cartes maison de 57 cartes.
- Des activités : casino en jetons, bar à mocktails, cinéma et karaoké avec vidéo partagée, arcade, bowling, karting, ruches, et une soirée Zombies.
- Une vie sociale : inventaire, échanges, amis, livre d'or, quêtes du jour, succès, appartements, et un réseau social interne.

### Sous le capot
Godot 4.7 (GDScript, rendu Compatibility pour le web) · un même projet sert de client dans le navigateur et de serveur autoritaire sans fenêtre · petit serveur Node qui sert le jeu et relaie le WebSocket · décors et matières 100 % procéduraux (marbre, bois, velours, ciel étoilé) · contenu en JSON.

### Où en est la filiale
Maquette complète, mise en pause pour les performances sur téléphone, puis relancée en octobre 2026 : le chantier en cours lui redonne l'ambiance de la maquette Three.js, en mieux (lumière, matières, son spatial, thèmes), sans rien rétrécir. Le salon du quotidien reste, en attendant, le Kaddour Social Club.
