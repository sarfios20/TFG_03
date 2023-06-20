console.log('heatmap.js loaded');

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

// Attach initMap to the window object
window.initMap = initMap;