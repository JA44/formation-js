// Rechargement AppCache
// =====================

'use strict';

var $ = require('jquery');

// Test simple de disponibilité de la gestion AppCache
if (window.applicationCache) {
  // Si le navigateur nous signale en cours d'utilisation de la page qu'on
  // vient de récupérer une nouvelle version, proposer à l'utilisateur
  // de la charger tout de suite, au moyen d'un Modal Dialog (Bootstrap).
  window.applicationCache.addEventListener('updateready', function() {
    $('#reloadPrompt').modal({ show: true });
  });
}
