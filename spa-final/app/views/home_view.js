// Contrôleur principal
// ====================

'use strict';

var moment = require('moment');
var View = require('./view');
var CheckInView = require('./check_in_view');
var HistoryView = require('./history_view');
var cnxSvc = require('lib/connectivity');
var userName = require('lib/notifications').userName;

module.exports = View.extend({
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'connectivity:online': 'syncMarker',
    'connectivity:offline': 'syncMarker'
  },
  // Le template principal
  template: require('./templates/home'),

  // Après le rendering complet (initial), on procède aux initialisations
  // de comportements et injections des vues imbriquées
  afterRender: function afterHomeRender() {
    // On met en cache le marqueur online/offline et on lui colle un tooltip façon Bootstrap
    this.syncMarker();
    // On lance l'horloge (en haut à droite)
    this.startClock();
    // On initialise et on render à la volée les deux vues imbriquées
    new CheckInView({ el: this.$('#checkInUI') }).render();
    new HistoryView({ el: this.$('#historyUI') }).render();
  },

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function getHomeRenderData() {
    // Moment.js c'est que du bonheur…
    return { now: moment().format('dddd D MMMM YYYY HH:mm:ss'), userName: userName };
  },

  // Lancement de l'horloge.  Un simple setInterval suffit…
  startClock: function startClock() {
    this.clock = this.clock || this.$('#ticker');
    var that = this;
    setInterval(function() {
      that.clock.text(that.getRenderData().now);
    }, 1000);
  },

  // Réaction à la notif de passage online/offline : on ajuste le marqueur
  syncMarker: function syncMarker() {
    this._onlineMarker = this._onlineMarker || this.$('#onlineMarker').tooltip({ placement: 'bottom' });
    this._onlineMarker[cnxSvc.isOnline() ? 'show' : 'hide']('fast');
  }
});
