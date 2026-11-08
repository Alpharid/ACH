Alphred est un majordome numérique : une IA qui tourne entièrement en local sur le PC du propriétaire, sans rien envoyer vers le cloud. On le pilote par un panneau de contrôle en forme de datapad, et on lui parle aussi bien au clavier qu'à la voix. Le ton est celui d'un majordome — posé, vouvoiement, humour pince-sans-rire — et toute la direction artistique (noir, or, ivoire) est construite autour de ce personnage.

### Ce qu'on y trouve
- Un modèle de langage local avec sa personnalité de majordome, accessible depuis le PC et le téléphone (chat type ChatGPT, sur le Wi-Fi de la maison).
- Un control panel « datapad » sans fenêtre : réveiller ou congédier Alphred, jauges système en direct, QR code pour le téléphone.
- Un mode vocal « sonnette » façon Jarvis : on sonne Alphred, puis « Hey Alphred, ouvre-moi YouTube », « éteins le PC et fais les mises à jour »… Il écoute, répond à voix haute et agit sur le PC ; les actions sensibles attendent un « Je confirme ».
- Un majordome à l'écran pendant le mode vocal : sprite en bas à droite qui change selon son état, avec une bulle de texte.
- Un agent de développement qui agit directement sur le PC (fichiers, code, Docker, Godot, recherche sur Internet), à qui Alphred peut confier les gros travaux. Il a tous les droits sur le PC, et fait une sauvegarde avant toute grosse opération.
- Un bouton « se modifier » : l'agent retouche lui-même la personnalité, le panneau ou les réglages d'Alphred.

### Sous le capot
Ollama (modèle Qwen 3.6 27B) · Open WebUI (Docker) · panneau et overlay en Godot 4 · Python pour le mode vocal (reconnaissance vocale sur la carte graphique, synthèse vocale locale) · Claude Code pour l'agent dev

### Où en est la filiale
Fonctionne de bout en bout : lancement et arrêt propres depuis le panneau, chat sur PC et mobile, mode vocal et agent dev opérationnels. Testé sur le poste du propriétaire (carte RTX 3090 Ti, 24 Go).

Novembre 2026 : l'agent a été allégé (il relit 2,6 fois moins de texte à chaque tour sur un gros projet) et le réglage du modèle corrigé (plus de mots d'une autre langue qui surgissent au milieu des phrases). Il a passé un test de reprise face à un modèle bien plus gros (enquête sans modification et traduction : aussi juste) et commence à prendre de petites corvées des autres projets, relues avant d'être gardées. Confronté à un modèle du cloud sur de vraies tâches d'un jeu de la maison, il s'en tire bien sur les corvées vérifiables (historique des changements, traductions contrôlées), plus lentement mais gratuitement ; les calculs, les tests et les faits passent par une relecture. Il prend ces corvées à l'essai.
