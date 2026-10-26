WifiSentinel est un outil d'audit de sécurité pour un réseau domestique et ses caméras IP, **strictement défensif**. Il répond à une question simple, « qu'est-ce qu'il faut corriger ici ? », sur un réseau dont on est propriétaire ou dont l'audit a été demandé par son propriétaire. Il se termine par un rapport de durcissement clair, à lui remettre.

L'interface est un *datapad* au style console rétro, posé sur le bureau, tandis que le moteur d'analyse travaille en arrière-plan. Aucune fonction d'attaque n'y figure, par principe : l'outil constate, explique et conseille.

### Ce qu'on y trouve
- L'inventaire des réseaux Wi-Fi visibles et le repérage des configurations trop faibles.
- La cartographie du réseau local : appareils présents et services qu'ils exposent.
- La détection des caméras IP et la vérification qu'elles n'ont pas gardé leurs réglages d'usine.
- Un testeur de robustesse pour la clé Wi-Fi que le propriétaire choisit de saisir.
- Un rapport de durcissement exporté, avec pour chaque faiblesse le correctif conseillé.

### Sous le capot
Python · Godot 4 · GDScript

### Où en est la filiale
Fonctionnelle et livrée sous forme d'exécutable Windows. Il reste un essai complet de bout en bout ; plus tard, l'outil gérera une liste de plusieurs réseaux autorisés.
