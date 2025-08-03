
const listing = window.listingData;
const coords = listing.geometry.coordinates; 


const map = L.map('map').setView([coords[1], coords[0]], 14);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);


L.marker([coords[1], coords[0]])
  .addTo(map)
  .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
  .openPopup();
