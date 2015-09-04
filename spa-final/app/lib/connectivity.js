// Détection online/offline
// ========================

'use strict';

// Ce module encapsule la gestion de la connectivité
// (états online/offline du navigateur) à destination des
// divers éléments externes (notamment la couche de persistence
// et les exploitations d'API externes type Google Maps / Places).

var $ = require('jquery');
var Backbone = require('backbone');

// On publie une seule méthode : isOnline.  Indique le bon état en
// live sur à peu près tous les browsers modernes.
exports.isOnline = function() { return true; };

if ('undefined' !== typeof navigator && 'onLine' in navigator) {
  exports.isOnline = function() { return !!window.mochaPhantomJS || navigator.onLine; };
  $(window).on('online offline', checkStatus);
  checkStatus();
}

// Ce callback interne publie les événements applicatifs de
// bascule de connectivité en réponse aux événements natifs.
function checkStatus() {
  Backbone.Mediator.publish(exports.isOnline() ? 'connectivity:online' : 'connectivity:offline');
}

