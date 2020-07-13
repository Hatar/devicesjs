layers.toGeoJSON().features[0].geometry.coordinates

map.on(L.Draw.Event.EDITED, function(e) {
  var layers = e.layers;
  layers.eachLayer(function(layer) {
    var featureId = L.stamp(layer);
    if (!layer.feature) {
      layer.feature = {
        'type': 'Feature'
      };
    }
    if (!layer.feature.properties) {
      layer.feature.properties = {};
    }
    layer.feature.properties._leaflet_id = featureId;
    layer.feature.properties.layerId = layer.options.layerId;
    if (typeof layer.getRadius === 'function') {
      layer.feature.properties.radius = layer.getRadius();
    }
    if (layer.feature.properties.feature_type === 'marker') {
      layer.unbindPopup();
      layer.bindPopup('Coordinates: ' + layer._latlng);
    }
  });

  console.log("edited shapes: " + JSON.stringify(layers.toGeoJSON()));

});