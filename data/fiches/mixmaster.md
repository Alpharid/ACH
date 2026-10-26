Un serveur privé, strictement familial, du MMORPG *MixMaster Online* (jeu de 2011). L'idée : retrouver le jeu tel que ses développeurs l'avaient conçu, puis l'enrichir proprement, sans aucun but commercial. Le dépôt ne contient aucun fichier du jeu — ni binaire du client, ni base de données — seulement le code, les scripts et la documentation faits maison autour.

Particularité : deux mondes tournent sur un même serveur, avec des comptes communs mais des personnages séparés.

### Ce qu'on y trouve
- Deux mondes pilotables séparément : un en français, un en anglais, chacun avec sa propre base de personnages
- Un Control Panel en forme de datapad : démarrer/arrêter chaque monde, régler les taux (expérience, butin, or) en direct, éditer comptes et personnages, cadeaux, actions et terminal d'administration
- Un launcher unique pour les joueurs : il installe, répare et se met à jour tout seul, avec un portail pour choisir son monde
- Une reprise du client français et un dispositif anti-triche côté serveur

### Sous le capot
Binaires serveur d'origine (2011) sous Docker · MySQL · passerelle, launcher et Control Panel en Godot · outils en Python et Lua

### Où en est la filiale
Jouable : connexion, création de personnage, combats et butin vérifiés en jeu. Les deux mondes et le client français sont testés sur banc ; reste l'essai en conditions réelles. Usage familial uniquement, rien n'est publié ni vendu.
