console.log('heatmap.js loaded');

var map;

function initMap() {
  // Check if the browser supports Geolocation
  if (navigator.geolocation) {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(function(position) {
      var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      // Create the map and center it on the user's location
      var map = new google.maps.Map(document.getElementById('map'), {
        center: userLatLng,
        zoom: 12 // Adjust the zoom level as desired
      });

      // Add other map markers or layers as needed
      // ...

    }, function() {
      // Handle Geolocation error
      console.log('Error: The Geolocation service failed.');
    });
  } else {
    // Browser doesn't support Geolocation
    console.log('Error: Your browser doesn\'t support geolocation.');
  }
}

// Attach initMap to the window object
window.initMap = initMap;