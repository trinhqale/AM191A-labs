// declare variables
// let zoomLevel = 5;
// const mapCenter = [34.0709, -118.444];

// // use the variables
// const map = L.map('the_map').setView(mapCenter, zoomLevel);
let mapOptions = { 'center': [36.2048, 138.2529], 'zoom': 6 }

// use the variables
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// create a function to add markers
function addMarker(lat, lng, title, message) {
    console.log(message)
    L.marker([lat, lng]).addTo(map).bindPopup(`<h2>${title}</h2> <h3>${message}</h3>`)
    return message
}



// use our marker functions
// addMarker(37, -122, 'home', 'home land!')
// addMarker(32, -118, 'work', 'where i work land!')
// addMarker(39, -119, 'location 1', 'random location')
// addMarker(36, -120, 'location 2', 'another random location')
fetch("map.geojson") // fetch the GeoJSON file, this is the name from step 2.
    .then(response => {
        return response.json();
    })
    .then(data => {
        var button 
        var takagiIcon = L.icon({
            iconUrl: data.features[0].properties.imageURL,
            iconSize: [40, 40] // size of the icon
        });
        var demonSlayerIcon = L.icon({
            iconUrl: data.features[1].properties.imageURL,
            iconSize: [40, 40] // size of the icon

        });
        var yourNameIcon = L.icon({
            iconUrl: data.features[2].properties.imageURL,
            iconSize: [40, 40] // size of the icon
        });
        // Basic Leaflet method to add GeoJSON data
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                //     const icons = new L.Icon({
                //         iconUrl: feature,
                //         iconSize: [40, 40],
                //     });
                //     return L.marker(latlng, { icon: icons })
                // }
                if (feature.properties.place === "Takagi-san") {
                    return L.marker(latlng, { icon: takagiIcon });
                } else if (feature.properties.place === "Demon Slayer") {
                    return L.marker(latlng, { icon: demonSlayerIcon });
                } else if (feature.properties.place === "Your Name") {
                    return L.marker(latlng, { icon: yourNameIcon });
                }
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.details);
            },
            
        }).addTo(map);
        var i = 0;    
        var myButton = L.control({ position: 'topright' });
        myButton.onAdd = function(map) {
          var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          var button = L.DomUtil.create('a', 'leaflet-control-button', container);
          button.innerHTML = 'Next';

          L.DomEvent.on(button, 'click', function() {
            next_location = data.features[i].geometry.coordinates  
            console.log(next_location)
            // call a function to zoom to a specific location
            map.flyTo([next_location[1], next_location[0]], 12);
            i+=1;
            if(i == data.features.length){
                i = 0;
                console.log(i)
            }
            
            
          });
          return container;
        };
        myButton.addTo(map);

       // create a custom control for the reset zoom button
var resetZoomControl = L.Control.extend({
    options: {
      position: 'topright'
    },
  
    onAdd: function (map) {
      // create the button element
      var button = L.DomUtil.create('button', 'reset-zoom-button');
      button.innerHTML = 'Reset Zoom';
  
      // add click event listener to the button
      L.DomEvent.addListener(button, 'click', function () {
        map.flyTo(mapOptions.center, mapOptions.zoom);
      });
  
      return button;
    }
  });
  
  // add the custom control to the map
  map.addControl(new resetZoomControl());
  
        
    });

/*
    L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
        const icons = new L.Icon({
            iconUrl: "https://i.imgur.com/ZcGeIVz.png",
            iconSize: [40, 40],
        });
        return L.marker(latlng, {icon: icons});
    }
}).addTo(mymap);
    */