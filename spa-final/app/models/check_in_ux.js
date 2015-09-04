// Modèle d'état de vue : CheckInUX
// ================================

// Ce modèle représente l'état de l'UX pour la sous-vue de check-in,
// ce qui permet notamment de faire du data-binding et de fluidifier
// la gestion d'état et sa logique applicative.

'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var cnxSvc = require('lib/connectivity');

module.exports = Backbone.Model.extend({
  defaults: {
    // Dernière géolocalisation en date
    lat: 0,
    lng: 0,

    // UUID Google Maps > Places du POI sélectionné
    placeId: null,

    // Dernière liste des POIs récupérés
    places: [],

    // Commentaire saisi par l'utilisateur
    comment: ''
  },

  // Définition d'attributs automatiques dérivés : `checkInForbidden` et
  // `fetchPlacesForbidden`.
  initialize: function() {
    var that = this;
    checkCheckinable();
    checkFetchable();

    this.on('change', checkCheckinable);
    Backbone.Mediator.subscribe('connectivity:online', checkFetchable);
    Backbone.Mediator.subscribe('connectivity:offline', checkFetchable);

    function checkCheckinable() {
      that.set('checkInForbidden', that.get('placeId') === null);
    }

    function checkFetchable() {
      that.set('fetchPlacesForbidden', !cnxSvc.isOnline());
    }
  },

  getPlace: function getPlace() {
    return _.findWhere(this.get('places'), { id: this.get('placeId') });
  }
});
