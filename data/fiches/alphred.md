Alphred est un majordome numérique : une IA qui tourne entièrement en local sur le PC du propriétaire, sans rien envoyer vers le cloud. On le pilote par un panneau de contrôle en forme de datapad, et on lui parle aussi bien au clavier qu'à la voix. Le ton est celui d'un majordome — posé, vouvoiement, humour pince-sans-rire — et toute la direction artistique (noir, or, ivoire) est construite autour de ce personnage.

### Ce qu'on y trouve
- Un modèle de langage local avec sa personnalité de majordome, accessible depuis le PC et le téléphone (chat type ChatGPT)
- Un control panel « datapad » sans fenêtre : réveiller ou congédier Alphred, jauges système en direct, QR code pour le téléphone
- Un mode vocal « sonnette » : on lui parle, il répond à voix haute, et les actions sensibles demandent une confirmation
- Un agent de développement qui agit directement sur le PC (fichiers, code, commandes) à la demande

### Sous le capot
Ollama (modèle Qwen 3.6 27B) · Open WebUI (Docker) · panneau en Godot 4 · Python pour le mode vocal · Claude Code pour l'agent dev

### Où en est la filiale
Fonctionne de bout en bout : lancement et arrêt propres depuis le panneau, chat sur PC et mobile, mode vocal et agent dev opérationnels. Testé sur le poste du propriétaire (carte RTX 3090 Ti, 24 Go).
