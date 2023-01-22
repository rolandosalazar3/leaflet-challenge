let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// GET request
d3.json(url).then(function (data) {
  // After response, call the createFeatures function with data.features
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Create a popup for place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // GeoJSON layer that contains the features array on earthquakeData and run the onEachFeature function for each item of data.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    // Point to layer to alter markers
    pointToLayer: function(feature, latlng) {

      // Style markers based on properties
      let markers = {
        radius: markerSize(feature.properties.mag),
    	color: 'black',
    	fillColor: chooseColor(feature.geometry.coordinates[2]),
    	weight: 1,
    	fillOpacity: 0.75,
    	stroke: true
      }
      return L.circle(latlng,markers);
    }
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

  // Create baseMaps object
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map with streetmap and earthquakes layers
  let dataMap = L.map("map", {center: [37.09, -95.71],zoom: 5,layers: [street, earthquakes]
  });

  // Add layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(dataMap);

  // Legend setup
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {  
    let div = L.DomUtil.create("div", "legend");

    div.innerHTML += '<i style="background: green"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: chartreuse"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: orangered"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>90+</span><br>';

  return div;
 };

legend.addTo(dataMap);
}