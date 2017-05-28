(() => {
  let map;
  let osmGeocoder;
  let marker = null;
  let circleMarker = null;
  const search = document.getElementById("search");
  window.addEventListener("load", initMap);

  if (!navigator.geolocation) {
    alert("Your browser does not support geolocation");
  }

  function initMap() {
    map = L.map("map2").setView([4.784468966579362, 75.67657470703125], 13);
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYXMwOTUiLCJhIjoiY2l5Y2ZwenY2MDE4MzJxazF1NWQ0a3g2ZiJ9.sYjDwFf_-q3lgrwH7L9f8g",
      {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      }
    ).addTo(map);

    osmGeocoder = new L.Control.OSMGeocoder({ text: "Localizar" });
    map.addControl(osmGeocoder);

    map.on("click", ev => {
      addMarker(ev.latlng);
    });

    $("#dist").bind("keyup mouseup", function() {
      circleMarker.setRadius(this.value * 1000);
    });

    locate(map);
  }

  function addMarker(location) {
    if (marker) {
      map.removeLayer(marker);
      map.removeLayer(circleMarker);
    }
    marker = L.marker(location, { draggable: true });
    circleMarker = L.circle([location.lat, location.lng], {
      color: "blue",
      radius: $("#dist").val() * 1000
    });

    marker.addTo(map);
    circleMarker.addTo(map);
    marker.bindPopup("!Estoy aquí").openPopup();
    circleMarker.bindPopup("Area de búsqueda");

    marker.on("dragend", function(ev) {
      map.removeLayer(circleMarker);
      circleMarker = L.circle([ev.target._latlng.lat, ev.target._latlng.lng], {
        color: "blue",
        radius: $("#dist").val() * 1000
      });

      circleMarker.addTo(map);
      circleMarker.bindPopup("Area de búsqueda");
    });
  }

  function locate(map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const initLocation = new L.LatLng(latitude, longitude);
          map.panTo(initLocation);
          addMarker(new L.LatLng(latitude, longitude));
        },
        err => console.log(err),
        { timeout: 10000 }
      );
    }
  }

  search.addEventListener("click", ev => {
    ev.preventDefault();
    document.getElementById("lat1").value = marker.getLatLng().lat;
    document.getElementById("lng1").value = marker.getLatLng().lng;
    document.getElementById("search-form").submit();
  });
})();
