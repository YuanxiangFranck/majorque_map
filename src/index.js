let L = require('leaflet');
let the_map = L.map('map_id').setView([45, -100], 5);

let coords = [ [ 50.516518, 6.993713, 179.872955 ], [ 50.516566, 6.993747,
  182.159027 ], [ 50.516566, 6.993747, 185.985626 ], [ 50.516582, 6.993847,
  185.639139 ], [ 50.516574, 6.99392, 185.112161 ], [ 50.516574, 6.994007,
  184.429534 ], [ 50.51657, 6.994085, 184.360963 ], [ 50.516551, 6.994153,
  184.073848 ], [ 50.516536, 6.994224, 183.630413 ], [ 50.516521, 6.994309,
  182.89103 ], [ 50.516507, 6.994385, 182.336178 ], [ 50.516485, 6.994459,
  182.047727 ], [ 50.516465, 6.994526, 181.656619 ], [ 50.516444, 6.994602,
  181.491205 ], [ 50.516403, 6.994652, 181.34429 ], [ 50.516386, 6.994722,
  181.494998 ], [ 50.516333, 6.994762, 181.33786 ], [ 50.516276, 6.99481,
  181.192811 ], [ 50.516223, 6.994854, 181.311627 ] ];

let marker_data = {pos: [ 50.516518, 6.993713, 179.872955 ],
                   image_path: "../images/tmp.png"};

function create_marker(data, map){
    let marker = L.marker(marker_data.pos);

    let html = `
<svg class="abc" style="width: 40px; height: 40px">
    <circle cx="20" cy="20" r="19" stroke="#000000" stroke-width="1" opacity="1"/>
    <image x="5" y="5" width="30" height="30" xlink:href="marker-icon.png">
</svg>`;
    let div_icon = L.divIcon({className:"leaflet-custom-div-icon", html: html, iconAnchor: [20, 20], popupAnchor:[0, -20]});

    marker.setIcon(div_icon);

    let popupContent = `
<div class="popup">
    <div class="event_title" style="background-color: ">Coucou </div>
    <div class="event_content">0<div><label>Time:</label>Salut</div>
    </div>
</div>`;
    marker.bindPopup(popupContent);
    marker.addTo(map);

}let line = L.polyline(coords);
line.addTo(map);
let bounds = line.getBounds();
map.fitBounds(bounds);
