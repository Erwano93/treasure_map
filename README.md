# Treasure Map

## Description

Ce projet est une simulation de mouvements d'aventuriers sur une carte. Les aventuriers peuvent se déplacer sur la carte, ramasser des trésors et changer d'orientation.

## Installation

1. Clonez ce dépôt sur votre machine locale.
2. Naviguez jusqu'au répertoire du projet.

## Utilisation

1. Créez un fichier d'entrée avec les instructions pour la carte et les aventuriers. Chaque instruction doit être sur une nouvelle ligne. Les lignes commençant par un "#" seront ignorées.
2. Exécutez le programme avec la commande `node treasure_map.js input.txt` (remplacez `input.txt` par le nom de votre fichier d'entrée).
3. Le programme affichera les positions des aventuriers dans le fichier `output.txt`.

## Format du fichier d'entrée

- `C - width - height` : Définit la taille de la carte.
- `M - x - y` : Place une montagne à une position spécifique.
- `T - x - y - n` : Place un trésor à une position spécifique avec `n` trésors.
- `A - name - x - y - orientation - movements` : Place un aventurier avec un nom spécifique, une position, une orientation (N, S, E, W) et une séquence de mouvements (A pour avancer, G pour tourner à gauche, D pour tourner à droite).
