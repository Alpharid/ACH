Super Toolbox est une boîte à outils open source et publique qui rassemble au même endroit les outils libres utiles aux autres filiales : modding et rétro-ingénierie de jeux, création de jeux sous Godot, physique et multijoueur, agents IA, audit réseau défensif, création d'assets. Les dépôts tiers y sont copiés tels quels, avec leur licence d'origine, et rangés par domaine dans un index d'une ligne par outil, pensé pour être lu vite, par un humain comme par une IA.

Ce qui la distingue, c'est **Heimdall**, un veilleur technologique : une méthode suivie par l'IA et outillée par des scripts, qui surveille les sorties de chaque domaine, rédige un digest daté et garde l'index à jour.

Depuis novembre 2026, elle a un deuxième cœur : **Hyperbole**, la « salle du temps ». Un orchestrateur, Mr. Popo, y envoie des joueurs simulés, les Einherjar (le tryhard, le casual, le flâneur, le streamer, le fouineur qui cherche les failles, le saboteur, le meneur…), jouer à un jeu dans des parties sans écran où une heure de PC vaut des heures de jeu. Ils ne trichent pas : ils n'ont que les touches d'un joueur et ce qu'un joueur voit et entend. Au retour, un rapport dit si le jeu tient des heures, s'il est amusant, si le défi est juste, ce qui s'apprend mal, et où sont les bugs, les blocages et les failles, chaque constat rejouable à l'identique. Tout tourne sur le PC, pour garder l'IA pour ce qu'une machine ne sait pas faire.

### Ce qu'on y trouve
- 29 dépôts open source copiés et synchronisables avec leur source d'origine (Jolt Physics, netfox, LimboAI, rea, GhidraMCP…).
- Un index par domaine et un catalogue détaillé par dépôt.
- Des guides par besoin : modder un jeu, physique sous Godot, IA locale, créer des assets, trouver une ressource, faire tourner un vieux jeu PC dans le navigateur, jouer en réseau par Internet à un vieux jeu « réseau local », peupler un jeu en ligne de joueurs IA qui jouent vraiment.
- Hyperbole : l'orchestrateur, dix profils de joueurs, un module pour Godot 4, un pont pour les autres moteurs, un jeu jouet avec un banc de bugs plantés (tous retrouvés), des rapports en page web.
- Les digests de veille de Heimdall, et une carte qui dit, pour chaque projet, quels outils s'appliquent et ce qui manque encore.
- Un script de maintenance pour vérifier la boîte, voir les nouveautés en amont, mettre à jour ou ajouter un outil.

### Sous le capot
git subtree · PowerShell · Python · Markdown et JSON

### Où en est la filiale
En service : le [dépôt est public](https://github.com/Alpharid/Super_Toolbox) et un digest de veille paraît chaque semaine. Hyperbole est en place depuis le 2 novembre 2026 ; Stryder Symbiosis est le premier jeu branché (5 novembre), Guardians of the Seal suivra. La boîte s'enrichit au fil des besoins des autres projets.
