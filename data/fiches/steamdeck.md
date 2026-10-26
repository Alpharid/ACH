Reprise en main complète d'un Steam Deck OLED configuré à l'origine par quelqu'un d'autre. L'idée : reprendre le contrôle de la console de bout en bout, comprendre comment elle est montée, la nettoyer, puis remettre l'émulation d'aplomb et l'automatiser. Tout est piloté en SSH depuis le PC, avec des scripts rejouables plutôt que des manipulations à la main.

### Ce qu'on y trouve
- Un accès complet et un inventaire détaillé de la machine (firmware, système, partitions, carte SD, Flatpaks, plugins, thèmes)
- Une réorganisation du stockage : jeux et émulation regroupés sur la carte SD, sauvegardes de parties conservées en interne
- La remise en ordre de l'émulation (EmuDeck et ES-DE, une vingtaine de systèmes), thèmes et médias inclus
- Une sauvegarde automatique et régulière des parties, en double (interne + SD)
- Des animations de démarrage et de veille tirées au hasard, et des scripts d'audit et de tri des ROMs

### Sous le capot
SteamOS (base Arch) · Bash · Python · EmuDeck / ES-DE / RetroArch · SSH

### Où en est la filiale
Configuration appliquée et stabilisée : stockage réorganisé, émulation fonctionnelle, sauvegardes automatiques en place. Prochaines étapes : resserrer le pare-feu et finir le rangement des médias et des jaquettes.
