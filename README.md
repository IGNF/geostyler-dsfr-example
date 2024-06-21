# geostyler-dsfr-example

**Exemple d'interface GeoStyler DSFR**

Interface basée sur [codegouv/react-dsfr](https://github.com/codegouvfr/react-dsfr) et intégrant les composants d'interface graphique de [GeoStyler](https://www.geostyler.org) en les personnalisant au [Système de Design de l'État (DSFR)](https://www.systeme-de-design.gouv.fr/).

Les composant d'interface graphique de GeoStyler sont basés sur [ant design](https://ant.design/) et ce sont les possibilités de personnalisation de ce framework qui sont utilisées pour appliquer une apparence "DSFR" à l'interface d'édition de style de GeoStyler.

## Objectif

Cet exemple sert à démontrer que les composants UI de GeoStyler sont personnalisables et sert de support pour maquetter des interfaces d'édition de styles pour cartes.gouv.fr.

## Développement

Installer les dépendances avec une option `--legacy-peer-deps` nécessaire car 2 versions d'OpenLayers sont utilisées dans ce dépôt.

```sh
npm install --legacy-peer-deps
```

Démarrer le serveur de développement

```sh
npm run dev
```

:rocket: le site est accessble à l'adresse : `http://localhost:5173/`.
