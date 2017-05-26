let map;
let marker = null;

window.addEventListener("load", initMap);
if (!navigator.geolocation) {
  alert("Your browser does not support geolocation");
}

function initMap() {
  map = L.map("map").setView([4.784468966579362, 75.67657470703125], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYXMwOTUiLCJhIjoiY2l5Y2ZwenY2MDE4MzJxazF1NWQ0a3g2ZiJ9.sYjDwFf_-q3lgrwH7L9f8g",
    {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }
  ).addTo(map);

  osmGeocoder = new L.Control.OSMGeocoder({ text: "Localizar" });
  map.addControl(osmGeocoder);
  locate(map);
}

function addMarker(location) {
  marker = L.marker(location, { draggable: false });
  marker.addTo(map);
}

function locate(map) {
  if (navigator.geolocation) {
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    if (lat && lng) {
      map.panTo(new L.LatLng(lat, lng));
      addMarker(new L.LatLng(lat, lng));
    }
  }
}
