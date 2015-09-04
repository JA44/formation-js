// Contrôleur zone historique
// ==========================

'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var View = require('./view');
var store = require('lib/persistence');

module.exports = View.extend({
  events: {
    'click li': 'showCheckInDetails'
  },
  // Le template interne pour la liste et ses éléments
  listTemplate: require('./templates/check_ins'),
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'checkins:new': 'insertCheckIn',
    'checkins:reset': 'render'
  },
  // Le template principal
  template: require('./templates/history'),

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function() {
    return {
      list: this.renderTemplate({ checkIns: store.getCheckIns() }, this.listTemplate)
    };
  },

  // Réagit à la notif de nouveau check-in en l'insérant en haut
  // de la liste.
  insertCheckIn: function(checkIn) {
    checkIn.extra_class = 'new';
    this.$('#history').prepend(this.renderTemplate({ checkIns: [checkIn] }, this.listTemplate));
    var that = this;
    _.defer(function() { that.$('#history li.new').removeClass('new'); });
  },

  showCheckInDetails: function showCheckInDetails(e) {
    var id = this.$(e.currentTarget).attr('data-id');
    if (!id) {
      return;
    }

    Backbone.history.navigate('check-in/' + id, { trigger: true });
  }
});
