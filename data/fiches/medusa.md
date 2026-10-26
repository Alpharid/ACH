Medusa Record est un logiciel de bureau pour Windows qui aide à enregistrer un **clip a cappella en mosaïque**. On chante une voix par prise (percussions, basse, chœurs, aigu, mélodie…) et le logiciel assemble toutes les prises dans une grille de 1 à 99 vignettes, synchronisées, mixées et exportées en MP4. Il s'adresse à qui chante seul et veut ce rendu de chorale sans logiciel de montage.

Sa particularité : il guide la séance. Pour chaque vignette, il indique quoi chanter, lance un décompte avec un clic, fait écouter au casque les prises déjà faites et recale lui-même les voix entre elles.

### Ce qu'on y trouve
- Accueil « Mes clips » et création d'un clip : nombre de vignettes, durée, format 16:9, 1:1 ou 9:16, mode guidé ou libre, tempo.
- Un studio dont la grille est fidèle à l'export, avec la caméra en direct dans la vignette en cours, un vumètre et un accordeur.
- Une synchronisation automatique : mesure de la latence au premier lancement, recalage sur un claquement de mains au début de chaque prise.
- Un mode *Avancé* pour le volume, le panoramique, le décalage de chaque voix, le retour à une ancienne prise et les réglages d'export.
- Un export MP4 au volume normalisé, et des mises à jour automatiques de la version installée.

### Sous le capot
Electron · JavaScript · Web Audio (AudioWorklet) · ffmpeg · electron-updater

### Où en est la filiale
Alpha : le cœur fonctionne et des installeurs Windows de test sont publiés dans les [Releases du dépôt public](https://github.com/Alpharid/Medusa_Record-builds/releases). La prochaine version, en cours, permettra de finir une prise avant la fin du clip et de la faire boucler ; viendront ensuite les essais en conditions réelles.
