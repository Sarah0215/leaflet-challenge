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
 var legend =L.control({position:'bottomright'});

 legend.onAdd = function(mymap){

     var dl =L.DomUtil.create('dl','legend_info'),
     grades = [-10,10,30,50,70,90];

 //Loop through our intervals and generate a label with a colored square for each
 for (var i=0; i<grades.length;i++){
     dl.innerHTML +=
         '<i style="background:'+ getColor(grades[i]+1)+'"></i> '+
         grades[i] + (grades[i+1]? '&ndash;'+grades[i+1]+'<br>':'+');
     }
     
     //background color of legend
     dl.style.backgroundColor = 'white';

     //color sample
     dl.innerHTML += '<div class="color-sample"></div>'; 

     return dl;
 };

 legend.addTo(myMap);

 }

// function that return of color

function getColor(depth) {
    if (depth >= 90) {
        return "red";
    } else if (depth >= 70) {
        return "lightred";
    } else if (depth >= 50) {
        return "orange";
    } else if (depth >= 30) {
        return "yellow";
    } else if (depth >= 10) {
        return "lime";
    } else {
        return "green";
    }
}