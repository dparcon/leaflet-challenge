// Create a Leaflet map
var map = L.map('map').setView([0, 0], 2);

// Add a base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
    // Plot the earthquakes on the map
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            // Customize the marker size based on earthquake magnitude
            var markerSize = feature.properties.mag * 5; // Adjust the multiplier for better visualization
            // Customize the marker color based on earthquake depth
            var markerColor = getColor(feature.geometry.coordinates[2]); // Get color based on depth
            return L.circleMarker(latlng, {
                radius: markerSize,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
        }
    }).addTo(map);

    // Create a legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '10px';
        var depths = [-10, 10, 30, 50, 70, 90];
        var labels = ['<strong>Depth</strong>'];
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(depths[i] + 1) + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px; border: 1px solid black"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km') + '<br>';
        }
        return div;
    };
    legend.addTo(map);
});

// Function to get color based on earthquake depth
function getColor(depth) {
    // Define color ranges based on depth
    if (depth > 90) {
        return "maroon";
    } else if (depth > 70) {
        return "red";
    } else if (depth > 50) {
        return "orange";
    } else if (depth > 30) {
        return "yellow";
    } else if (depth > 10) {
        return "green";
    } else if (depth >-10) {
        return "lime";
    }
}
