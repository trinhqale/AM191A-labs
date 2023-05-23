// declare variables
let mapOptions = { 'center': [34.0709, -118.444], 'zoom': 10 }

// use the variables
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// create a function to add markers
function addMarker(data) {
    let location = data['What\'s your location']
    L.marker([data.lat, data.lng]).addTo(map).bindPopup(`<h2>${location}</h2> <h3>${(data['Do you like Anime/Manga?'] == "Yes") ? "Watch Anime" : "Do not watch Anime"}</h3>`)
    createButtons(data.lat, data.lng, location)
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



const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9F9sPBHAGC7mf9_UH-tc0LJd-4oaiDn1cm7baZQ81tfrNqq9yHDFpLT5UQ1S3y6d73mA2eV9zx2fc/pub?output=csv"


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
}

loadData(dataUrl)