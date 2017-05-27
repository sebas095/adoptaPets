(() => {
  let map;
  let osmGeocoder;
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
    const pets = getData();
    addPetstoMap(map, pets);
  }

  function addMyMarker(location) {
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(location, { draggable: false });
    marker.addTo(map);
    map.panTo(location);
    marker.bindPopup("!Estoy aquí").openPopup();
  }

  function addPetstoMap(map, pets) {
    const icon = L.icon({
      iconUrl: "/adopta-pets/img/markers/position.png",
      shadowUrl: "/adopta-pets/img/markers/shadow.png",
      iconSize: [48, 48], // size of the icon
      shadowSize: [48, 48], // size of the shadow
      iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
      shadowAnchor: [7, 40], // the same for the shadow
      popupAnchor: [0, -48] // point from which the popup should open relative to the iconAnchor
    });

    for (let i = 0, pet = pets[i]; i < pets.length; i++) {
      const petMarker = L.marker(new L.LatLng(pet.lat, pet.lng), {
        draggable: false,
        icon
      });
      petMarker.addTo(map);
      petMarker.bindPopup(
        `<div class="row">
           <div class="col s12 m12">
             <div class="card">
               <div class="card-image">
                 <img src="${pet.photo}" width="100" height="100">
                 <span class="card-title orange-text" style="text-align: center !important">${pet.name}</span>
               </div>
               <div class="card-content">
                 <div class="row">
                   <h5 class="center amber-text icon ap-cat-7"> Características</h5>
                   <div class="input-field col l6 m12 s6">
                     <i class="material-icons prefix">color_lens</i>
                     <input type="text" id="pet.color" name="pet.color" readonly="" value="${pet.color}" aria-required="true">
                     <label for="pet.color">Color</label>
                   </div>
                   <div class="input-field col l6 m12 s6">
                     <i class="material-icons prefix">zoom_out_map</i>
                     <input type="text" id="pet.size" name="pet.size" readonly="" value="${pet.size}" aria-required="true">
                     <label for="pet.size">Tamaño</label>
                   </div>
                 </div>
                 <div class="row">
                   <div class="input-field col l6 m6 s12">
                     <div class="col s8">
                       <i class="material-icons prefix">add_circle</i>
                       <input type="number" id="pet.age" name="pet.age" readonly="" value="${pet.age}">
                       <label for="pet.age">Edad</label>
                     </div>
                     <div class="col s4">
                       <input name="pet.time" id="pet.time" readonly value="${pet.time}" aria-required="true">
                     </div>
                   </div>
                   <div class="input-field col l6 m12 s6">
                     <i class="material-icons prefix">pets</i>
                     <input type="text" id="pet.gender" name="pet.gender" readonly="" value="pet.gender" aria-required="true">
                     <label for="pet.gender">Sexo</label>
                   </div>
                 </div>
                 <div class="row">
                   <div class="input-field col m6 s12">
                     <i class="icon ap-dog-2 prefix"></i>
                     <input type="text" id="pet.type" name="pet.type" readonly="" value="${pet.type}" aria-required="true">
                     <label for="pet.type">Tipo</label>
                   </div>
                 </div>
                 <div class="row">
                   <div class="input-field col l6 offset-m3 m12 s6">
                     <a class="btn waves-effect waves-light cyan darken-2 white-text" href="/adopta-pets/publications/${pet.id}">Ver más</a>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>`
      );
    }
  }

  function locate(map) {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const initLocation = new L.LatLng(latitude, longitude);
          map.panTo(initLocation);
          addMyMarker(new L.LatLng(latitude, longitude));
        },
        err => console.log(err),
        { timeout: 10000 }
      );
    }
  }

  function getData() {
    let pets = [];
    const data = document.querySelectorAll(".data");
    for (let i = 0; i < data.length; i += 11) {
      const pet = {
        photo: data[i].value,
        id: data[i + 1].value,
        name: data[i + 2].value,
        color: data[i + 3].value,
        size: data[i + 4].value,
        age: data[i + 5].value,
        time: data[i + 6].value,
        gender: data[i + 7].value,
        type: data[i + 8].value,
        lat: parseFloat(data[i + 9].value),
        lng: parseFloat(data[i + 10].value)
      };
      pets.push(pet);
    }
    return pets;
  }
})();
