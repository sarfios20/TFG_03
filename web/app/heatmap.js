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
        zoom: 12, // Adjust the zoom level as desired
        styles: [
          // Apply the provided style array here
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [
              { "color": "#202c3e" }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
              { "gamma": 0.01 },
              { "lightness": 20 },
              { "weight": "1.39" },
              { "color": "#ffffff" }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "weight": "0.96" },
              { "saturation": "9" },
              { "visibility": "on" },
              { "color": "#000000" }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
              { "visibility": "off" }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
              { "lightness": 30 },
              { "saturation": "9" },
              { "color": "#29446b" }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              { "saturation": 20 }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              { "lightness": 20 },
              { "saturation": -20 }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              { "lightness": 10 },
              { "saturation": -30 }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#193a55" }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              { "saturation": 25 },
              { "lightness": 25 },
              { "weight": "0.01" }
            ]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
              { "lightness": -20 }
            ]
          }
        ]
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