# Configuration Brunch
# ====================

exports.config =
  # See https://github.com/brunch/brunch/blob/stable/docs/config.md for documentation.
  files:
    javascripts:
      joinTo: 'app.js'
    stylesheets:
      joinTo: 'app.css'
    templates:
      joinTo: 'app.js'

  modules:
    nameCleaner: (path) ->
      path
        # Strip app/ and app/externals/ prefixes
        .replace /^app\/(?:externals\/)?/, ''
        # Allow -x.y[.z…] version suffixes in mantisses
        .replace /-\d+(?:\.\d+)+/, ''
        # Allow -fr lang suffixes in mantisses
        .replace '-fr.', '.'

  plugins:
    appcache:
      externalCacheEntries: [
        'http://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png'
        'http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png'
        'http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png'
        'http://maps.gstatic.com/mapfiles/place_api/icons/wine-71.png'
      ]
      network: ['*', 'http://*', 'https://*']

  server:
    path: 'jst-server.coffee'

  watcher:
    usePolling: true
