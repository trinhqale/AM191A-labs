// declare variables
let mapOptions = { 'center': [34.0709, -118.444], 'zoom': 10 }

// use the variables

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

let anime = L.featureGroup();
let noAnime = L.featureGroup();

let layers = {
    "Do watch Anime": anime,
    "Do not watch Anime": noAnime
};

let circleOptions = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9F9sPBHAGC7mf9_UH-tc0LJd-4oaiDn1cm7baZQ81tfrNqq9yHDFpLT5UQ1S3y6d73mA2eV9zx2fc/pub?output=csv"
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);
L.control.layers(null, layers).addTo(map);

// create a function to add markers
function addMarker(data) {
    let location = data['What\'s your location']
        // L.marker([data.lat, data.lng]).addTo(map).bindPopup(`<h2>${location}</h2> <h3>${(data['Do you like Anime/Manga?'] == "Yes") ? "Watch Anime" : "Do not watch Anime"}</h3>`)
        // createButtons(data.lat, data.lng, location)
        // return location
    let story = data['Share your anime experience. Could be anything about your favorite anime or your favorite genre.'] || "None"
    let hours = data['How many hours a week do you spend watching anime?'] || 0
    if (data['Do you like Anime/Manga?'] == "Yes") {
        circleOptions.fillColor = "red"
        anime.addLayer(L.circleMarker([data.lat, data.lng], circleOptions)
            .bindPopup(`<h2>Location: ${location}</h2>
                        <h2>Do Watch Anime</h2>
                        <h3>${hours} Hours/week <h3>
                        <h3>Description: ${story} </h3>`))
        createButtons(data.lat, data.lng, location)
    } else {
        circleOptions.fillColor = "blue"
        noAnime.addLayer(L.circleMarker([data.lat, data.lng], circleOptions)
            .bindPopup(`<h2>Location: ${location}</h2>
                          <h2>Do not watch Anime</h2>
                          <h3>${hours} Hours/week <h3>
                          <h3>Description: ${story} </h3>`))

        createButtons(data.lat, data.lng, location)
    }
    return location

}

function createButtons(lat, lng, title) {
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button" + title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat", lat); // sets the latitude 
    newButton.setAttribute("lng", lng); // sets the longitude 
    newButton.addEventListener('click', function() {
        map.flyTo([lat, lng]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton); //this adds the button to our page.
}

function loadData(url) {
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results) {
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
            // addMarker(data.lat, data.lng, (data['Do you like Anime/Manga?'] == "Yes") ? "Watch Anime" : "Do not watch Anime", "Hours watched: " + (data['How many hours a week do you spend watching anime?'] || 0))
    })
    anime.addTo(map) // add our layers after markers have been made
    noAnime.addTo(map) // add our layers after markers have been made  
    let allLayers = L.featureGroup([anime, noAnime]);
    map.fitBounds(allLayers.getBounds());
}

loadData(dataUrl)