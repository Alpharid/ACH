Super Toolbox est une boîte à outils open source et publique qui rassemble au même endroit les outils libres utiles aux autres filiales : modding et rétro-ingénierie de jeux, création de jeux sous Godot, physique et multijoueur, agents IA, audit réseau défensif, création d'assets, diagnostic automobile. Les dépôts tiers y sont copiés tels quels, avec leur licence d'origine, et rangés par domaine dans un index d'une ligne par outil, pensé pour être lu vite, par un humain comme par une IA.

Ce qui la distingue, c'est **Heimdall**, un veilleur technologique : une méthode suivie par l'IA et outillée par des scripts, qui surveille les sorties de chaque domaine, rédige un digest daté et garde l'index à jour.

Depuis novembre 2026, elle a un deuxième cœur : **Hyperbole**, la « salle du temps ». Un orchestrateur, Mr. Popo, y envoie des joueurs simulés, les Einherjar (le tryhard, le casual, le flâneur, le streamer, le fouineur qui cherche les failles, le saboteur, le meneur…), jouer à un jeu dans des parties sans écran où une heure de PC vaut des heures de jeu. Ils ne trichent pas : ils n'ont que les touches d'un joueur et ce qu'un joueur voit et entend. Au retour, un rapport dit si le jeu tient des heures, s'il est amusant, si le défi est juste, ce qui s'apprend mal, et où sont les bugs, les blocages et les failles, chaque constat rejouable à l'identique. Tout tourne sur le PC, pour garder l'IA pour ce qu'une machine ne sait pas faire.

### La méthode Alpharium
La boîte garde aussi la façon dont on travaille, née sur Guardians of the Seal : le propriétaire décide, Claude fabrique. Chaque sujet a son chantier, avec sa fiche écrite et sa propre session ; une session d'orchestration porte les réponses, veille sur les autres et seule publie. Dès qu'un choix revient au propriétaire, une page sombre s'ouvre sur son écran, une question par bloc, avec la préférence de Claude cochée d'avance. Autour, des agents faits maison : des joueurs IA qui jouent sans tricher, un « regard » qui relit les rendus, une gazette qui résume chaque jour leurs rapports, des chaînes qui peignent, animent, composent et trient avant de soumettre. Le PC fait tout ce qu'il sait faire ; l'API de Claude ne sert que là où elle vaut son prix : quelques centaines d'appels pour moins de 8 $ en deux semaines, par un seul petit client qui refuse tout projet que le propriétaire n'a pas autorisé. Chaque incident y devient une règle écrite.

[Voir la méthode Alpharium d'un coup d'œil](https://alpharid.github.io/ACH/methode/) : le schéma, les chiffres, les outils, et ce qui a raté.

### Ce qu'on y trouve
- 29 dépôts open source copiés et synchronisables avec leur source d'origine (Jolt Physics, netfox, LimboAI, rea, GhidraMCP…).
- Un index par domaine et un catalogue détaillé par dépôt.
- Des guides par besoin : modder un jeu, physique sous Godot, IA locale, créer des assets, trouver une ressource, faire tourner un vieux jeu PC dans le navigateur, jouer en réseau par Internet à un vieux jeu « réseau local », peupler un jeu en ligne de joueurs IA qui jouent vraiment, mener plusieurs chantiers à la fois avec Claude, faire trancher le propriétaire par une page, relire des rendus par un juge visuel, tirer une gazette des rapports de joueurs IA, faire la musique d'un jeu en local, dépenser peu en tokens et en GPU.
- Des outils maison prêts pour tout projet : le client de l'API Claude (journal des dépenses, plafond, lots, et la liste des projets autorisés), le « regard » qui relit les rendus, le recompte automatique des chiffres de la méthode.
- Hyperbole : l'orchestrateur, dix profils de joueurs, un module pour Godot 4, un pont pour les autres moteurs, un jeu jouet avec un banc de bugs plantés (tous retrouvés), des rapports en page web.
- Les digests de veille de Heimdall, et une carte qui dit, pour chaque projet, quels outils s'appliquent et ce qui manque encore.
- Un script de maintenance pour vérifier la boîte, voir les nouveautés en amont, mettre à jour ou ajouter un outil.

### Sous le capot
git subtree · PowerShell · Python · Markdown et JSON

### Où en est la filiale
En service : le [dépôt est public](https://github.com/Alpharid/Super_Toolbox) et un digest de veille paraît chaque semaine. Hyperbole est en place depuis le 2 novembre 2026 ; Stryder Symbiosis est le premier jeu branché (5 novembre) ; depuis le 8 novembre, les joueurs IA de Guardians of the Seal écrivent aussi son journal (rapport par profil, comparaison entre deux versions du jeu). La boîte s'enrichit au fil des besoins des autres projets.
