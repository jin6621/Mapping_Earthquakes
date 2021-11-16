// Add console.log to check if code is working.
console.log("Working.")

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    //tileSize: 512,
    //zoomOffset: -1,
    accessToken: API_KEY
});

// We create the tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    //tileSize: 512,
    //zoomOffset: -1,
    accessToken: API_KEY
});

let baseMaps = {
    Street: streets,
    "Satellite": satelliteStreets
}

// Create the map object with a center and zoom level. 
let map = L.map('mapid', {
        center: [39.5, -98.5],
        zoom: 3,
        layers: [streets]     // This is the default tile layer.
})

// Create the earthquake layer for our map. 
let earthquakes = new L.layerGroup();
// We define an object that contains the overlays. This overlay will be visible all the time.
let overlays = {
    "Earthquakes": earthquakes
}

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);



// Accessing the airport GeoJSON URL
let json_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
    };
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

function getColor(magnitude){
    if (magnitude > 5) {
        return "#ea2c2c";
    }
    if (magnitude > 4) {
        return "#ea822c";
    }
    if (magnitude > 3) {
        return "#ee9c00";
    }
    if (magnitude > 2) {
        return "#eecc00";
    }
    if (magnitude > 1) {
        return "#d4ee00";
    }
    return "#98ee00";
    }

d3.json(json_url).then(function(data){
    console.log(data);          //Ensure our data is working
    L.geoJSON(data, {           // Creating a GeoJSON layer with the retrieved data.
        
        // Turn each feature into a marker on the map. 
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng).bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><hr>Location: " + feature.properties.place);
        },
        style: styleInfo,
    }).addTo(earthquakes);      // Add all the circle markers to "earthquake layer", not map.

    // We add thee earthquake layer to the map.
    earthquakes.addTo(map);
})

// Create a legend control object.
let legend = L.control({
    position: "bottomright"
});
// Then add all the details for the legend.
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    
    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");}
        
return div;
    }

legend.addTo(map);





