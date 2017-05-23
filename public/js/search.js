if (!navigator.geolocation) {
  alert("Your browser does not support geolocation");
}

const search = document.getElementById("search");
search.addEventListener("click", ev => {
  ev.preventDefault();
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      document.getElementById("lat1").value = latitude;
      document.getElementById("lng1").value = longitude;
      document.getElementById("search-form").submit();
    },
    err => console.log(err),
    { timeout: 10000 }
  );
});
