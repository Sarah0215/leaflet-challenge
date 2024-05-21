// Create a map object.
let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Store the API variables.
let allweekUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(allweekUrl).then(function (data) {

// Once we get a response, send the data.features object to the createFeatures function. 
   createFeatures(data.features);
    // console.log(createFeatures);
  });
  
function createFeatures(earthquakeData) {

    const geoJsonLayer = L.geoJSON(earthquakeData, {
        pointToLayer: function(geoJsonPoint, latlng) {
            const depth = geoJsonPoint.geometry.coordinates[2];
            let color= getColor(depth);

            // Create a GeoJSON layer that contains the features array on the earthquakeData object.
            // Run the onEachFeature function once for each piece of data in the array.
            const circleMarker = L.circle(latlng, {
                radius: geoJsonPoint.properties.mag * 10000,
                color: color,
                weight: 1,
                fillOpacity: 0.7
            });

            // Give each circleMarker a popup that describes the place and time of the earthquake.
            circleMarker.bindPopup(`<h3>${geoJsonPoint.properties.place}</h3><hr><p>${new Date(geoJsonPoint.properties.time)}</p>`);
            
            return circleMarker;
            
        }
    });

    // Add GeoJSON to map.
    geoJsonLayer.addTo(myMap);


//Add legend
let legend =L.control({position:'bottomright'});

legend.onAdd = function(map){
    let div =L.DomUtil.create('div','info legend');
    let depths = [-10,10,30,50,70,90];
    let labels = [];

////Adding background color of legend, boarder and padding to legend

    div.style.backgroundColor = 'white';
    div.style.border = '1px solid black';
    div.style.padding = '10px';

//Loop through our intervals and generate a label with a colored square for each
    for (let i=0; i<depths.length;i++){
        div.innerHTML +=
            '<div style="display: flex; align-items: center;">' +
            '<i style="background:'+ getColor(depths[i])+'; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
            '<span>'+depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1]:'+')+'</span>'+'</div>';
    }
    
    return div;

};

legend.addTo(myMap);

}

function getColor(depth) {
    if (depth >= 90) {
        return "red";
    } else if (depth >= 70) {
        return "tomato";
    } else if (depth >= 50) {
        return "orange";
    } else if (depth >= 30) {
        return "yellow";
    } else if (depth >= 10) {
        return "darkseagreen";
    } else {
        return "green";
    }
}