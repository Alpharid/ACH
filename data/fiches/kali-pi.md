Un Raspberry Pi 5 sous Kali Linux, monté à l'arrière d'un écran tactile 7", piloté à distance en SSH depuis le PC. L'ensemble forme un petit poste polyvalent : un « datapad » tactile façon Matrix sur la dalle, un outil d'audit défensif du réseau familial, et une télécommande pour les autres appareils de la maison.

L'usage sécurité est strictement défensif et consenti : vérifier l'état du réseau de proches (avec leur accord) pour repérer et corriger les faiblesses, jamais pour en tirer parti.

### Ce qu'on y trouve
- Un datapad tactile plein écran (interface à menus 800×480, pluie de caractères verte) qui remonte l'état réel de la machine
- Un volet d'audit défensif : inventaire des appareils du réseau et revue du durcissement, pour identifier ce qui est à corriger
- Un bureau graphique à distance depuis le PC (VNC au travers d'un tunnel SSH chiffré)
- Le pilotage d'autres appareils depuis la dalle (PC, console, téléphone), pensé aussi comme pupitre pour les sessions de jeu de rôle

### Sous le capot
Raspberry Pi 5 · Kali Linux · Python (serveur local stdlib + interface web) · SSH · VNC

### Où en est la filiale
En service : écran tactile, bureau distant et datapad fonctionnels, pilotage multi-appareils en place. Le volet audit s'enrichit, toujours dans un cadre privé et consenti.
