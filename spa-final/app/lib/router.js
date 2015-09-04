// Routeur
// =======

'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var application = require('application');
var store = require('lib/persistence');
var CheckInDetailsView = require('views/check_in_details_view');

module.exports = Backbone.Router.extend({
  // Déclaration
  // -----------
  routes: {
    // La route racine, pour la page principale
    '': 'home',
    // La route de détail de check-in
    'check-in/:id': 'showCheckIn'
  },

  // Gestionnaires
  // -------------

  // Route racine : affichage principal.
  home: function() {
    // Vu que cet affichage persiste en arrière-plan, c'est un peu spécial : on ne le fait qu'une fois
    if (this.homeRendered) {
      return;
    }

    $('body').html(application.homeView.render().el);
    this.homeRendered = true;
  },

  // Route de détail : modal de check-in
  showCheckIn: function(id) {
    // Le contenu principal est censé être en arrière-plan : si on arrive sur l'appli
    // avec un route de détail, assurer le principal d'abord.
    this.home();

    // On récupère le check-in (s'il est suffisamment ancien, ça nécessitera un GET Ajax dédié,
    // d'où le callback) pour afficher le détail.
    store.getCheckIn(id, function(error, checkIn) {
      if (error) {
        CheckInDetailsView.cancel();
      } else {
        CheckInDetailsView.display(checkIn);
      }
    });
  }
});
