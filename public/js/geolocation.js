let map;
let marker = null;
const submit = document.getElementById("save");

submit.addEventListener("click", ev => {
  ev.preventDefault();
  save();
});

window.addEventListener("load", initMap);
if (!navigator.geolocation) {
  alert("Your browser does not support geolocation");
}

function initMap() {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      map = L.map("map").setView([latitude, longitude], 13);
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYXMwOTUiLCJhIjoiY2l5Y2ZwenY2MDE4MzJxazF1NWQ0a3g2ZiJ9.sYjDwFf_-q3lgrwH7L9f8g",
        {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18
        }
      ).addTo(map);
    },
    err => console.log(err),
    {
      timeout: 10000
    }
  );
  // map = new google.maps.Map(document.getElementById("map"), {
  //   streetViewControl: false,
  //   zoom: 16,
  //   fullscreenControl: false
  // });
  //
  // google.maps.event.addListener(map, "click", ev => {
  //   addMarker(ev.latLng);
  // });
  // locate(map);
}

function addMarker(location) {
  if (marker != null) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: location,
    draggable: true,
    map: map
  });
}

function locate(map) {
  if (navigator.geolocation) {
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    if (lat && lng) {
      const initLocation = new google.maps.LatLng(lat, lng);
      map.setCenter(initLocation);
      addMarker({ lat, lng });
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const initLocation = new google.maps.LatLng(latitude, longitude);
          map.setCenter(initLocation);
          addMarker({
            lat: latitude,
            lng: longitude
          });
        },
        err => console.log(err),
        { timeout: 10000 }
      );
    }
  }
}

function performData(marker) {
  // let latlng = {
  //   lat: parseFloat(marker.getPosition().lat()),
  //   lng: parseFloat(marker.getPosition().lng())
  // };
  //
  // let GEOCODER = new google.maps.Geocoder();
  // let related = null;
  //
  // GEOCODER.geocode({ location: latlng }, (results, status) => {
  //   if (status === google.maps.GeocoderStatus.OK) {
  //     if (results[1]) {
  //       related = results[0].formatted_address;
  //     } else {
  //       console.log("No results found");
  //     }
  //   } else {
  //     console.log("Geocoder failed due to: " + status);
  //   }
  //   document.getElementById("lat").value = marker.getPosition().lat();
  //   document.getElementById("lng").value = marker.getPosition().lng();
  //   document.getElementById("address").value = related;
  //   document.getElementById("publication-form").submit();
  // });
}

function hideAlert() {
  $("#required-map").hide("slow");
}

function save() {
  if (marker === null) {
    document.getElementById("required-map").style.display = "inline-block";
  } else {
    hideAlert();
    performData(marker);
  }
}
