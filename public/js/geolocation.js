(() => {
  let map;
  let osmGeocoder;
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

    map.on("click", ev => {
      addMarker(ev.latlng);
    });
    locate(map);
  }

  function addMarker(location) {
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(location, { draggable: true });
    marker.addTo(map);
  }

  function locate(map) {
    if (navigator.geolocation) {
      const lat = parseFloat(document.getElementById("lat").value);
      const lng = parseFloat(document.getElementById("lng").value);
      if (lat && lng) {
        map.panTo(new L.LatLng(lat, lng));
        addMarker(new L.LatLng(lat, lng));
      } else {
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
  }

  function performData(marker) {
    let warnings = [];
    const geocodeService = L.esri.Geocoding.geocodeService();
    geocodeService.reverse().latlng(marker.getLatLng()).run((error, result) => {
      if (error) {
        console.log("La dirección no fue encontrada");
        document.getElementById("address").value = "";
      } else {
        document.getElementById("address").value = result.address.Match_addr;
      }
      document.getElementById("lat").value = marker.getLatLng().lat;
      document.getElementById("lng").value = marker.getLatLng().lng;
      if (!document.getElementById("type").value) {
        warnings.push("<li>*Tipo</li>");
      }
      if (!document.getElementById("size").value) {
        warnings.push("<li>* Tamaño</li>");
      }
      if (!document.getElementById("pet.name").value) {
        warnings.push("<li>* Nombre</li>");
      }
      if (!document.getElementById("pet.age").value) {
        warnings.push("<li>* Edad</li>");
      }
      if (!document.getElementById("pet.time").value) {
        warnings.push("<li>* Tiempo</li>");
      }
      if (!document.getElementById("gender").value) {
        warnings.push("<li>* Sexo</li>");
      }
      if (!document.getElementById("color").value) {
        warnings.push("<li>* Color</li>");
      }
      if (
        document.getElementById("color").value === "otro" &&
        !document.getElementById("otherColor").value
      ) {
        warnings.push("<li>* Otro Color</li>");
      }
      if (!document.getElementById("phone").value) {
        warnings.push("<li>* Teléfono</li>");
      }
      if (!document.getElementById("email").value) {
        warnings.push("<li>* Correo</li>");
      }
      if (warnings.length > 0) {
        $(
          `<div class="row" id="alert_box">
            <div class="col s12">
              <div class="card red">
                <div class="row">
                  <div class="col s12 m10">
                    <div class="white-text">
                      <blockquote>
                        Los siguientes campos son requeridos:
                        <ul>
                          ${warnings.join("\n")}
                        </ul>
                      </blockquote>
                    </div>
                  </div>
                  <div class="col s12 m2">
                    <i class="fa fa-times icon_style" id="alert_close" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>`
        ).insertBefore("#warnings");
        $("#alert_close").click(() => $("#alert_box").fadeOut("slow"));
      } else {
        document.getElementById("publication-form").submit();
      }
    });
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
})();
