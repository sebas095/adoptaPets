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

  google.maps.event.addListener(map, 'click', (ev) => {
    addMarker(ev.latLng);
  });
  locate(map);
}

function addMarker(location) {
  if (marker != null) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: location,
    draggable: true,
    map: map,
  });
}

function locate(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords;
      const initLocation = new google.maps.LatLng(latitude, longitude);
      map.setCenter(initLocation);
      addMarker({
          lat: latitude,
          lng: longitude,
      });
    });
  }
}

function performData(marker) {
  let latlng = {
    lat: parseFloat(marker.getPosition().lat()),
    lng: parseFloat(marker.getPosition().lng()),
  };

  let GEOCODER = new google.maps.Geocoder;
  let related = null;

  GEOCODER.geocode({'location': latlng}, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        related = results[0].formatted_address;
      } else {
        console.log('No results found');
      }
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
    document.getElementById('lat').value = marker.getPosition().lat();
    document.getElementById('lng').value = marker.getPosition().lng();
    document.getElementById('address').value = related;
    document.getElementById('publication-form').submit();
  });
}

function hideAlert() {
  $('#required-map').hide('slow');
}

function save() {
  if (marker === null) {
    document.getElementById('required-map').style.display = 'inline-block';
  } else {
    hideAlert();
    performData(marker);
  }
}
