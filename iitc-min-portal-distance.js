// ==UserScript==
// @id             iitc-plugin-min-portal-distance@setup
// @name           IITC plugin: Min Portal Distance
// @category       Layer
// @version        0.1.0.20190111.21337
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://static.iitc.me/build/release/plugins/zaprange.meta.js
// @downloadURL    https://static.iitc.me/build/release/plugins/zaprange.user.js
// @description    [iitc-2019-01-11-021337] Shows the minimal distance between portals for submission.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
if(typeof window.plugin !== 'function') window.plugin = function() {};

plugin_info.buildName = 'iitc';
plugin_info.dateTimeVersion = '20180111.21337';
plugin_info.pluginId = 'portaldist';




  window.plugin.portalrange = function() {};
  window.plugin.portalrange.portalLayers = {};
  window.plugin.portalrange.MINIMUM_MAP_ZOOM = 16;



  window.plugin.portalrange.portalAdded = function(data) {
    data.portal.on('add', function() {
      window.plugin.portalrange.draw(this.options.guid);
    });

    data.portal.on('remove', function() {
      window.plugin.portalrange.remove(this.options.guid);
    });
  }



  window.plugin.portalrange.remove = function(guid) {
    var previousLayer = window.plugin.portalrange.portalrangeLayers[guid];
    if(previousLayer) {
      window.plugin.portalrange.portalrangeLayers.removeLayer(previousLayer);
      delete window.plugin.portalrange.portalrangeLayers[guid];
    }
  }



  window.plugin.portalrange.draw = function(guid) {
    var portal = window.portals[guid];


    var coo = portal._latlng;
    var latlng = new L.LatLng(coo.lat, coo.lng);

    var circleOptions = {color:'green', opacity:0.9, fillColor:'green', fillOpacity:0.2, weight:2, clickable:false, dashArray: [6,3]};
    var range = 20; 

    var circle = new L.Circle(latlng, range, circleOptions);

    circle.addTo(window.plugin.portalrange.portalrangeLayers);
    window.plugin.portalrange.portalrangeLayers[guid] = circle;
  }


  window.plugin.portalrange.showOrHide = function() {
      if(map.getZoom() >= window.plugin.portalrange.MINIMUM_MAP_ZOOM) {
          if(!window.plugin.portalrange.portalLayerHolderGroup.hasLayer(window.plugin.portalrange.portalrangeLayers)) {
              window.plugin.portalrange.portalLayerHolderGroup.addLayer(window.plugin.portalrange.portalrangeLayers);
        $('.leaflet-control-layers-list span:contains("portalrange")').parent('label').removeClass('disabled').attr('title', '');
      }
    } else {
          if(window.plugin.portalrange.portalLayerHolderGroup.hasLayer(window.plugin.portalrange.portalrangeLayers)) {
              window.plugin.portalrange.portalLayerHolderGroup.removeLayer(window.plugin.portalrange.portalrangeLayers);
        $('.leaflet-control-layers-list span:contains("portalrange")').parent('label').addClass('disabled').attr('title', 'Zoom in to show those.');
      }
    }
  }

  var setup =  function() {
    window.plugin.portalrange.portalLayerHolderGroup = new L.LayerGroup();

    window.plugin.portalrange.portalrangeLayers = new L.LayerGroup();

    window.plugin.portalrange.portalLayerHolderGroup.addLayer(window.plugin.portalrange.portalrangeLayers);

    window.addLayerGroup('Min Portal Dist', window.plugin.portalrange.portalLayerHolderGroup, true);

    window.addHook('portalAdded', window.plugin.portalrange.portalAdded);

    map.on('zoomend', window.plugin.portalrange.showOrHide);

    window.plugin.portalrange.showOrHide();
  }




setup.info = plugin_info; 
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
if(window.iitcLoaded && typeof setup === 'function') setup();
} 

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


