# Code splitting d'une SPA 2016/2017

Présentation:

twitter: @iamdey
mastodon: @dey@mastodon.xyz
job: ethical frontend dev @Gandi

# Plein de nouveautés pour moi

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

Utilisation de webpack1, kotatsu, ES6

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
/(anon) }- bundle.js < async < ----- home.js
/signin }     !------------------------------------------------------ vendors.js
                                                        !                 +- jQuery
/signup }- bundle.js < async < ----- signup.js          !                 +- foundation
              !                       +- zxcvbn.js      !                 +- moment
              !------------------------------------------                 +- ...
                                                        !
/ (authenticated) }- bundle.js < async < --main.js      !
                      !----------------------------------
                                                        !
/compose }- bundle.js < async < -----------main.js      !
                !----------------------------------------
                                        (chiffrement?) <- async load <- openpgp.js
                                                                            !< web worker < (process)
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

```
[
  '@gandi/react-translate',
  'axios',
  'foundation-sites',
  'jquery',
  'lodash.throttle',
  'react',
  'react-dom',
  'redux',
  // ...
]
```

À voir : https://webpack.js.org/guides/code-splitting-libraries/
Attention de bien aller au bout du document avec le manifest qui permet la mise en cache de vendor.

# Un wrapper qui charge les chunks en asynchrone

Ça se complique un peu là.

## Webpack1

Avant (entre autre) : `require.ensure`
Un callback s'assurait que le module est chargé.

FIXME: comment se passe le découpage ?

(En regardant le component <AsynLoader> de calypso je tombé sur leur plugin babel qui transpile les require, arbnb a fait le sien aussi)
Maintenant : le plugin babel Dynamic Import http://babeljs.io/docs/plugins/syntax-dynamic-import/

```
import('./module')
  .then(module => {
    // ...
  });
```

## Webpack2

Simplification: `import()` est géré par webpack est sort une promesse.

# Demo React

## contexte

Application avec un bouton de login qui affiche un form et la complexité du mdp

1. exec et poids initial du bundle
2. séparation des vendors
3. async loader

# Références

* Le composant `AsyncLoad` de calypso https://github.com/Automattic/wp-calypso/tree/master/client/components/async-load
* Code splitting dans webpack1 http://webpack.github.io/docs/code-splitting.html
* Code splitting dans webpack2 https://webpack.js.org/guides/code-splitting-libraries/
* Tutorial React (webpack2) https://hackernoon.com/straightforward-code-splitting-with-react-and-webpack-4b94c28f6c3f#.h5oo6ycrn
* Le composant `Async` utilisé https://github.com/didierfranc/react-code-splitting
* react conf 2017 - code splitting https://www.youtube.com/watch?v=bb6RCrDaxhw&list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0&index=25

# The End

photo de chat
tw @iamdey
prez: frama.link
