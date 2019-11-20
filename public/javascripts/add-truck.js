// const axios = require("axios")

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94cHJvamVjdCIsImEiOiJjazJ6eXNqcWIwajd4M21zMDlxamdxYTZpIn0.2yA5cyZqIRxwYPwxku-tUQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [13.40, 52.52],
  zoom: 12

});

let marker = new mapboxgl.Marker({
  draggable: true,
  color: "red",

}).setLngLat([13.3890, 52.5169]).addTo(map);

marker.on("dragend", () => {
  console.log(marker.getLngLat());
  let lnglat = marker.getLngLat();
  document.getElementById("lat").value = lnglat.lat;
  document.getElementById("lng").value = lnglat.lng;
});





