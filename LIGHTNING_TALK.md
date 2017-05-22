# Code splitting d'une SPA 2016/2017

Présentation:

twitter: @iamdey
mastodon: @dey@mastodon.xyz
job: ethical frontend dev @Gandi

**Plein de nouveautés pour moi**

react, avant angularjs 1
travail en remote
nouveau à Nantes
premier talk depuis ... non premier talk technique

# Étude de cas : Caliopen

Caliopen c'est un aggrégateur de messageries qui met évidence la confidentialité dans les échanges privés.

Ex: Est-ce qu'un mail est confidentiel ?
Spoil : non. C'est l'équivalent d'une carte postale.
En pire.

# Bref, code splitting

## C'est quoi ? Pourquoi ?

La taille du bundle.

An 2000 : images / swf

(Avant on se souciait de la taille des images, swf etc., mais les bouts de js et de css, osef ... an 2000, hein)

Un peu après : les vendors, jQuery & ses potes

* concat ou cdn ?

(ok avec les vendors on va peut être concat tout ça et virer les commentaires voir même uglify si on est un peu foufou)
(ou alors on profite du cache navigateur en utilisant nos propres cdn ou des gros assez connus)
(pour une app secure, j'en suis pas convaincu)

# Contexte (outils de build)

Utilisation de webpack1, babel, kotatsu, ES6

(On aurait pu utiliser gush, gulp, ou webpack2 (ou même un makefile quand on et un peu nerd)
(mais là webpack1, par ce que c'est ce qu'on avait quand j'ai démarré la refonte react et que j'ai du kotatsu pour le gérer)
(Webpack c'est chouette, un peu tordu mais chouette)
(coup de bol webpack c'est du code splitting à la base : "les chunks")

# Étude des sources

* source-map-explorer

(Voilà on a un gros bundle de ... 2.57mo
(Pour une app orienté mobile c'est pas génial)

* bundle.js : / • 2.57 MB • 100.0%
* complexité de mot de passe, utilisé à la création de compte : zxcvbn • 819 kB • 31.8%
* librairie utilitaire rarement mise à jour : foundation-sites • 345 kB • 13.4%
* lib chiffrement utilisé à la création de compte, dans le cas de message chiffré, dans les settings pour la gestion des clé : openpgp • 325 kB • 12.6%
* librairie utilitaire rarement mise à jour : jquery • 300 kB • 11.7%
* l10n des dates/heures, contient bp de locales non implem : moment • 200 kB • 7.8%
* code source réel, change à chaque maj :

# Proposition de découpage

```
/(anon|authenticated) }- app.js
/signin }                  !------------------------------------------ vendors.js
                                                        !                 +- jQuery
/signup }- app.js < dyn import < ----- signup.js        !                 +- foundation
              !                         +- zxcvbn.js    !                 +- moment
              !------------------------------------------                 +- ...
                                                        !
/compose }- app.js                                      !
              !------------------------------------------
              !
              !------ [chiffrement ?] < dyn import < openpgp.js
                                             !          !----< web worker < (process)
/(contact|profile) }- app.js                 !
                        |------ [clés PGP ?]--
```

2 actions:

* séparer les vendors (pas tous) #easyWin
  (C'est ce que l'on a commencé à faire en 2000) (si on s'arrête là c'est bien mais la taille des
  bundles cummulés reste la même)
* Charger en asynchrone les différentes partie de l'app

> [TL;DR] https://hackernoon.com/straightforward-code-splitting-with-react-and-webpack-4b94c28f6c3f#.h5oo6ycrn

# Split vendors

Gestion des modules js à la ES6 avec Webpack 1 ou 2.

Le code splitting est rendu possible grâce à `webpack.optimize.CommonsChunkPlugin`.

Cette étape est requise pour la suite.

Spécifier les vendors à concaténer:

```js
{
  entry: {
    app: [/****/],
    vendor: [
      '@gandi/react-translate',
      'axios',
      'foundation-sites',
      'jquery',
      'lodash.throttle',
      'react',
      'react-dom',
      'redux',
      // ...
    ],
  },
  /****/
  plugins: [
    /****/,
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
    }),
  ],
}
```

## Mais si je change mes vendors ?

L'enfer du cache navigateur.

* Il faut avoir les hash dans les fichiers générés
  -> utiliser `HtmlWebpackPlugin`
* Configurer le "Manifest"

```js
{
  /****/
  output: {
    filename: '[name].[chunkhash].js',
  },
  /****/
  plugins: [
    /****/,
    new CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
  ],
}
```

À voir : https://webpack.js.org/guides/code-splitting-libraries/

# Un wrapper qui charge les chunks en asynchrone

Ça se complique un peu là (... mais alors juste un peu).

## Webpack1

**Avant** (entre autres) : `require.ensure`
Un callback s'assurait que le module est chargé.

FIXME: comment se passe le découpage ?

**Entre temps** : le component `<AsynLoader>` de Wordpress Calypso et leur plugin babel qui transpile les `require`.

**Maintenant** : le plugin babel/webpack de Airbnb `Dynamic Import` http://babeljs.io/docs/plugins/syntax-dynamic-import/

```
import('./module')
  .then(module => {
    // ...
  });
```

Nécessite l'installation de `babel-plugin-dynamic-import-webpack` et son activation dans `.babelrc`:

```json
{
  "...": "...",
  "plugins": ["...", "dynamic-import-webpack"]
}
```

## Webpack2

Simplification: `import()` est gérée par webpack.
Le plugin `dynamic-import-webpack` n'est plus utile, la syntaxe est identique.

_That's all folks_

# Demo React

## contexte

Application avec un bouton de login qui affiche un form et la complexité du mdp

1. exec et poids initial du bundle
2. séparation des vendors
3. async loader

# Démo Caliopen

* source-map de la release, taille des chunks
* chunk SSR inutile (mais présent pour la consistence)
* La prise en charge des modules css

* app.js : / • 257 kB • 100.0%
* vendor.js : / • 1.62 MB • 100.0% (foundation, jquery, moment, ..., react & co)
* 1.js (pgp-manager): openpgp • 331 kB • 99.4%
* 2.js (Signup): zxcvbn • 819 kB • 93.6%

# Troubleshouting

**Compat HMR** : cf. https://github.com/gaearon/react-hot-loader/blob/master/docs/Known%20Limitations.md

**Librairies dynamiques communes:** Risque de duplication dans les chunks.
Il faut faire en sorte que le point d'entrée soit le même partout.

**Temps de build** : cf. https://github.com/webpack/webpack/issues/4636
Je n'ai pas personnellement remarqué.

# Waou génial !

Mais par contre comment ça se passe avec **SSR** ou electron/cordova ?

Avec `componentWillMount` ?!

Nopenonononono

_Les effets de bord dans `componentWillMount` etc. sont un anti-pattern!_

Il y a bien des libs React qui propose le chargement asynchrone:

* `Async` de didierfranc : `componentWillMount` + `forceUpdate` :(
* `ReactLoader` de CognizantStudio : `componentDidMount` + es5 + useless DOM requierements
* `AsyncLoad` dans calypso : `componentWillMount` (╯°□°）╯︵ ┻━┻
* `ReactLoadable` de thejameskyle : `componentWillMount` ┻━┻︵ \(°□°)/ ︵ ┻━┻
    + plugin babel 	┬──┬﻿ ノ( ゜-゜ノ)

## Alors ?

Je n'ai pas la réponse, mais :

* A-t-on réellement besoin de générer le rendu des contenus asynchrone ?
* Peut être même que ça optimise l'utilisation de la mémoire d'une app "native"
* `ReactLoadable` semble être la solution la plus complexe mais la plus proche pour SSR (si c'est nécessaire).

# Références

* Les slides : <TODO>
* La demo https://github.com/iamdey/RD-code_splitting_webpack_react
* Code splitting dans webpack1 http://webpack.github.io/docs/code-splitting.html
* Code splitting dans webpack2 https://webpack.js.org/guides/code-splitting-libraries/
* Tutorial React (webpack2) https://hackernoon.com/straightforward-code-splitting-with-react-and-webpack-4b94c28f6c3f#.h5oo6ycrn
* Le composant `Async` utilisé https://github.com/didierfranc/react-code-splitting
* Le composant `AsyncLoad` de calypso https://github.com/Automattic/wp-calypso/tree/master/client/components/async-load
* Le composant `ReactLoadable` https://github.com/thejameskyle/react-loadable
* Le composant `ReactLoader` https://github.com/CognizantStudio/react-loader
* react conf 2017 - code splitting https://www.youtube.com/watch?v=bb6RCrDaxhw&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0&index=25
* May be deprecation of componentWillMount https://github.com/facebook/react/issues/7671

# The End

photo de chat
tw @iamdey
prez: frama.link
