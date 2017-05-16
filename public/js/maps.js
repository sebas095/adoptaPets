let map;
let marker = null;

google.maps.event.addDomListener(window, 'load', initMap);
if (!navigator.geolocation) {
  alert('Your browser does not support geolocation');
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    zoom: 16,
    fullscreenControl: false,
  });

  locate(map);
}

function addMarker(location) {
  if (marker != null) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: location,
    draggable: false,
    map: map,
  });
}

function locate(map) {
  if (navigator.geolocation) {
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    if (lat && lng) {
      const initLocation = new google.maps.LatLng(lat, lng);
      map.setCenter(initLocation);
      addMarker({lat, lng});
    }
  }
}
