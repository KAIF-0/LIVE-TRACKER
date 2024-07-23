const socket = io();

// Geolocation options
const geoOptions = {
  timeout: 5000, // 5 seconds timeout
  enableHighAccuracy: true, // Request high accuracy
  maximumAge: 0,
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      socket.emit("send-position", { longitude, latitude });
      console.log("Latitude:", latitude, "Longitude:", longitude);
    },
    (error) => {
      console.error("Error getting geolocation:", error);
    },
    geoOptions
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Live-Tracking App",
}).addTo(map);

const markers = {};

socket.on("recieve-position", (data) => {
  const { id, longitude, latitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLetLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
