let Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// GET request
d3.json(Url).then(data => {
  // After response, call the createFeatures function with data.features
  createFeatures(data.features);
});

// Function based on depth of the earthquake
function colorWheel(depth) {
  if (depth >= 90) 
    return '#d40011';
  else if (depth > 80) 
    return '#fc602a';
  else if (depth > 70) 
    return '#fd9d3c';
  else if (depth > 60) 
    return '#fdac4f';
  else if (depth > 50)
    return '#fec14c';
  else if (depth > 40) 
    return '#eac86d';
  else if (depth > 30) 
    return '#fece76';
  else if (depth > 20) 
    return '#dff0a3';
  else if (depth > 10) 
    return '#badd8e';
  else 
    return '#68b736';
}

// Style function for markers
function styleInfo(feature) {
  return {
    radius: markerSize(feature.properties.mag),
    color: 'black',
    fillColor: colorWheel(feature.geometry.coordinates[2]),
    weight: 1,
    fillOpacity: 0.7,
    stroke: true
  }
}
// Function for marker size
  function markerSize(mag) {
    return mag * 1800;
  }

function createFeatures(earthquakeData) {

    // Create a popup for place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    // GeoJSON layer that contains the features array on earthquakeData and run the onEachFeature function for each item of data.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      // Point to layer to alter markers
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,
        styleInfo(feature)
        );
      }
    });
    // Run earthquakes layer with the createMap function
      createMap(earthquakes);
  }

  function createMap(earthquakes) {

    // Create base layers
    //Street layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    //Topographic layer
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
    let dataMap = L.map("map", {center: [37.09, -95.71],zoom: 7,layers: [street, earthquakes]});

    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(dataMap);
  
 // Legend setup
 let legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   let div = L.DomUtil.create("div", "info legend");
   let limits = [-10, 10, 20, 30, 40, 50, 60, 70, 80, 90];;
   let colors = ['#d40011', '#fc602a', '#fd9d3c', '#fdac4f', '#fec14c', '#eac86d', '#fece76', '#dff0a3', '#badd8e', '#68b736'];
   let labels = [];
   let legendInfo = "<h1>Depth of Earthquake<br />km</h1>"+
     "<div class=\"labels\">" +
       "<div class=\"min\">" + limits[0] + "</div>" +
       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
     "</div>";
   div.innerHTML = legendInfo;
   limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });
   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

    legend.addTo(dataMap);
}