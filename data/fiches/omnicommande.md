Omnicommande est une télécommande personnelle : depuis le PC, une seule fenêtre montre l'état d'un Steam Deck, d'un Raspberry Pi et d'un téléphone Android, et permet de les piloter. La même application tourne aussi sur le Raspberry Pi, où elle pilote le PC, et sur le Steam Deck. Rien n'est à installer sur les appareils pilotés, qui sont joints par SSH ou par le débogage Android.

Son allure est celle d'une **station de contrôle tactique** : orange sur ardoise, panneaux à coins coupés, jauges segmentées, dans une fenêtre sans cadre à la silhouette découpée.

### Ce qu'on y trouve
- Un tableau de bord de la flotte : batterie, températures, processeur, mémoire, stockage, jeu en cours.
- La capture d'écran ou le direct de chaque appareil, et l'écran interactif du téléphone.
- Des actions système : volume, luminosité, veille, redémarrage, mises à jour, ouverture d'applications.
- Les fichiers par glisser-déposer, avec une corbeille sur l'appareil plutôt qu'un effacement direct.
- La collection de jeux du Steam Deck, avec un dossier de dépôt pour les nouveaux.

### Sous le capot
Python · SSH (paramiko) · adb et scrcpy · HTML, CSS et JavaScript · Electron

### Où en est la filiale
Bêta : en service sur le PC, le Raspberry Pi et le Steam Deck, testée sur les vrais appareils ; la partie téléphone reste à valider. Prévu ensuite : le streaming de jeu à distance et un terminal intégré.
