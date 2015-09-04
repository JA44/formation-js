// Contrôleur zone de check-ins
// ============================

'use strict';

var View = require('./view');
var CheckInUX = require('models/check_in_ux');
var locSvc = require('lib/location');
var poiSvc = require('lib/places');
var store = require('lib/persistence');
var userName = require('lib/notifications').userName;
var _ = require('underscore');

module.exports = View.extend({
  bindings: {
    // Binding simple du texte de commentaire
    '#comment': 'comment',
    // Binding de rendering des POI
    '#places': {
      observe: ['places', 'placeId'],
      onGet: function() { return this.getRenderData().placeList; },
      updateMethod: 'html'
    },
    // Binding composite à formatage personnalisé pour la dernière géoloc connue
    '#geoloc': {
      observe: ['lat', 'lng'],
      onGet: function getGeolocText(pos) {
        if (_.isString(pos[0]) || pos[0] === 0 && pos[1] === 0) {
          return 'Je suis…';
        }

        return pos[0].toFixed(7) + ' / ' + pos[1].toFixed(7);
      }
    },
    // Binding sur attribut `disabled` du bouton d'envoi de check-in
    'button[type=submit]': {
      attributes: [{
        name: 'disabled',
        observe: 'checkInForbidden'
      }]
    },
    // Binding sur attribut `disabled` du bouton de rafraîchissement de POI
    'header button': {
      attributes: [{
        name: 'disabled',
        observe: 'fetchPlacesForbidden'
      }]
    }
  },
  // Les événements UI auxquels on réagit
  events: {
    'click header button': 'fetchPlaces',
    'click #places li': 'selectPlace',
    'submit': 'checkIn'
  },
  // Notre template de liste
  listTemplate: require('./templates/places'),
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'connectivity:online': 'fetchPlaces'
  },
  // Notre template principal
  template: require('./templates/check_in'),

  initialize: function initializeCheckInView() {
    // "super"
    View.prototype.initialize.apply(this, arguments);
    this.model = new CheckInUX();
  },

  afterRender: function() {
    this.fetchPlaces();
  },

  // Envoi d'un check-in
  checkIn: function(e) {
    e.preventDefault();
    if (this.model.get('checkInForbidden'))
      return;

    var place = this.model.getPlace();
    // On soumet le check-in à la couche de persistence.  L'événement app-wide
    // qu'elle déclenchera (checkins:new) activera l'insertion dans l'historique.
    store.addCheckIn({
      userName: userName,
      placeId: place.id,
      name: place.name,
      vicinity: place.vicinity,
      icon: place.icon,
      comment: this.model.get('comment')
    });
    // Remise "à zéro" de l'UI de check-in
    this.model.set({ placeId: null, comment: '' });
  },

  // Désactive l'UI de check-in le temps de récupérer la géoloc actuelle
  // et les POI associés.
  fetchPlaces: function() {
    this.model.set(this.model.defaults);
    var that = this;
    // On récupère la géoloc…
    locSvc.getCurrentLocation(function(lat, lng) {
      that.model.set({ lat: lat, lng: lng });
      if (_.isString(lat)) {
        return;
      }
      // Et du coup, on choppe les POI
      poiSvc.lookupPlaces(lat, lng, function(places) {
        that.model.set('places', places);
      });
    });
  },

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  // Le searching est juste là pour afficher le spinner si pas de
  // POI, afin de différencier avec le contexte de l'historique, ou pas
  // d'éléments = juste du vide…
  getRenderData: function() {
    return {
      placeList: this.renderTemplate(this.model.pick('places', 'placeId'), this.listTemplate)
    };
  },

  // Réagit au clic dans la liste des POI pour faire sélection et activer l'UI
  // de check-in.
  selectPlace: function(e) {
    var placeId = this.$(e.currentTarget).attr('data-place-id');
    this.model.set('placeId', placeId);
  }
});
