(() => {
  let map;
  let osmGeocoder;
  let marker = null;
  window.addEventListener("load", initMap);

  if (!navigator.geolocation) {
    alert("Your browser does not support geolocation");
  }

  function initMap() {
    const lat = document.getElementById("lat").value;
    const lng = document.getElementById("lng").value;

    map = L.map("map").setView([lat, lng], 13);
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYXMwOTUiLCJhIjoiY2l5Y2ZwenY2MDE4MzJxazF1NWQ0a3g2ZiJ9.sYjDwFf_-q3lgrwH7L9f8g",
      {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      }
    ).addTo(map);

    osmGeocoder = new L.Control.OSMGeocoder({ text: "Localizar" });
    map.addControl(osmGeocoder);

    addMarker(new L.LatLng(lat, lng));
    const pets = getData();
    addPetstoMap(map, pets);
    window.location.href += "#results";
  }

  function addMarker(location) {
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(location, { draggable: false });
    marker.addTo(map);
    map.panTo(location);
    marker.bindPopup("!Estoy aquí").openPopup();
  }

  function addPetstoMap(map, pets) {
    const catIcon = L.icon({
      iconUrl: "/adopta-pets/img/markers/cat.png",
      iconSize: [48, 48], // size of the icon
      iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -48] // point from which the popup should open relative to the iconAnchor
    });

    const dogIcon = L.icon({
      iconUrl: "/adopta-pets/img/markers/dog.png",
      iconSize: [48, 48], // size of the icon
      iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -48] // point from which the popup should open relative to the iconAnchor
    });

    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      let icon = pet.type === "gato" ? catIcon : dogIcon;
      const petMarker = L.marker(new L.LatLng(pet.lat, pet.lng), {
        draggable: false,
        icon
      });
      petMarker.addTo(map);
      if (pet.photo.includes("default")) {
        petMarker.bindPopup(
          `<div class="row">
             <div class="col s12 m12">
               <div class="card">
                 <div class="card-image">
                   <img src="${pet.photo}" width="100" height="auto">
                    <span class="card-title orange-text">${pet.name}</span>
                 </div>
               </div>
                <div class="input-field col s12">
                  <a class="btn waves-effect waves-light cyan darken-2 white-text" href="/adopta-pets/publications/${pet.id}">Ver más</a>
                </div>
             </div>
           </div>`
        );
      } else {
        petMarker.bindPopup(
          `<div class="row">
             <div class="col s12 m12">
               <div class="card">
                 <div class="card-image">
                   <img src="${pet.photo}" width="100" height="auto">
                 </div>
               </div>
                <div class="input-field col s12">
                  <a class="btn waves-effect waves-light cyan darken-2 white-text" href="/adopta-pets/publications/${pet.id}">Ver más</a>
                </div>
             </div>
           </div>`
        );
      }
    }
  }

  function getData() {
    let pets = [];
    const data = document.querySelectorAll(".data");
    for (let i = 0; i < data.length; i += 6) {
      let photo = "";
      if (data[i].value === "none") {
        if (data[i + 3].value === "gato") {
          photo = "/adopta-pets/img/default-cat.svg";
        } else {
          photo = "/adopta-pets/img/default-dog.svg";
        }
      } else {
        photo = data[i].value;
      }
      const pet = {
        photo: photo,
        id: data[i + 1].value,
        name: data[i + 2].value,
        type: data[i + 3].value,
        lat: parseFloat(data[i + 4].value),
        lng: parseFloat(data[i + 5].value)
      };
      pets.push(pet);
    }
    return pets;
  }
})();
