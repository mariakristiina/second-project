// const axios = require("axios")

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94cHJvamVjdCIsImEiOiJjazJ6eXNqcWIwajd4M21zMDlxamdxYTZpIn0.2yA5cyZqIRxwYPwxku-tUQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapboxproject/ck3904d080f171ctbb7rqokg0',
  center: [13.40, 52.52],
  zoom: 12

});
let icon = document.createElement('div');
icon.className = 'marker';
let marker = new mapboxgl.Marker(icon, {
  draggable: true,
  color: "red",

}).setLngLat([13.3890, 52.5169]).addTo(map);

marker.on("dragend", () => {
  console.log(marker.getLngLat());
  let lnglat = marker.getLngLat();
  document.getElementById("lat").value = lnglat.lat;
  document.getElementById("lng").value = lnglat.lng;
});