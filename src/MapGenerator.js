let L = require('leaflet');
require("leaflet-routing-machine");
require("leaflet-providers");

function createHTMLElement(tagName, attributes, style={}, parent) {
    let element = document.createElement(tagName);
    for (let [attr, value] of Object.entries(attributes)) {
        if (attr === 'innerText')
            element.innerText = value;
        else if (attr === 'innerHTML')
            element.innerHTML = value;
        else
            element.setAttribute(attr, value);
    }
    for (let st in style) {
        element.style.setProperty(st, style[st]);
    }
    if (parent instanceof HTMLElement) {
        parent.appendChild(element);
    }
    else if (typeof(parent) === 'string'){
        document.getElementById(parent).appendChild(element);
    }
    else if (parent != null)
        console.log("type error" ,parent);
    return element;
}

class MapGenerator {
    constructor(div_id) {
        this.map = L.map(div_id);
        this.map_id = div_id;
        this.bounds = new L.LatLngBounds();
        L.tileLayer.provider("OpenTopoMap").addTo(this.map);
    }

    create_map_interface(){
        let zoomDiv = this.map.getContainer().getElementsByClassName('leaflet-control-zoom')[0];
        let scaleButton = createHTMLElement('a', {class: "leaflet-control-zoom-out", href: '#', title: 'Auto Scale', innerText:  "⟳"},
                                            {}, // Style
                                            zoomDiv); // Parent
        let newCallback = ev =>{
            ev.preventDefault();
            if (!this.bound.isValid()) return;
            this.map.fitBounds(this.bound);
        };
        scaleButton.addEventListener('click', newCallback);

        let legend = L.control({position: 'topright'});
        legend.onAdd = ()=>{
            let legend_div = createHTMLElement("div", {class: 'map-header'});
            legend_div.innerHTML = `
<div class="content_legend">
   <input type="button" class="button j1">j1</input>
   <input type="button" class="button j2">j2</input>
</div>
<div class="logo_legend">

</div>
`;
            let j1_button = legend_div.getElementsByClassName("j1")[0];
            let j2_button = legend_div.getElementsByClassName("j2")[0];
            j1_button.addEventListener("click", ()=>{
                alert(0);
            });
            j2_button.addEventListener("click", ()=>{
                alert(10);
            });
            return legend_div;
        };
        legend.addTo(this.map);
    }

    create_marker(date, data){
        let marker = new L.Marker(data.pos);
        if (this.bounds.isValid())
            this.bounds.extend(data.pos);
        else
            this.bounds = new L.LatLngBounds(L.latLng(...data.pos),
                                             L.latLng(...data.pos));
        
        let carouselId = "carousel-"+date[1];
        let marker_html = `
<svg class="abc" style="width: 40px; height: 40px">
    <circle cx="20" cy="20" r="19" stroke="#000000" stroke-width="1" opacity="1"/>
    <image x="5" y="5" width="30" height="30" xlink:href="marker-icon.png">
</svg>`;
        let div_icon = L.divIcon({className:"leaflet-custom-div-icon", html: marker_html, iconAnchor: [20, 20], popupAnchor:[0, -20]});

        marker.setIcon(div_icon);

        let imgs_html = "";
        let image_path = data.image_path;
        if (image_path == undefined) image_path = [];
        // Indicators
        imgs_html += "<div class='carousel-indicators'>";
        for (let i=0;i<image_path.length;i++) {
            imgs_html += `<li data-target='#${carouselId}' data-slide-to='${i}' ${i?'':'class="active"'}></li>`;
        }
        imgs_html += '</div>';
        // slides warpper
        imgs_html += "<div class='carousel-inner' role='listbox'>";
        for (let i=0;i<image_path.length;i++){
            let img_name = image_path[i];
            imgs_html += `
    <div class="item ${i?'':'active'}">
      <img src="${data.dir_path+img_name}" alt="...">
      <div class="carousel-caption">
        ...
      </div>
    </div>`;
        }
        imgs_html += "</div>";
        // Controles
        imgs_html += `
  <a class="left carousel-control" href="#${carouselId}" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#${carouselId}" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>`;
        imgs_html += '</div>';
        let popupContent = `
<div class="popup">
    <div class="event_title" style="background-color: ">${data.description}</div>
    <div id="${carouselId}" class="carousel slide img_frame_container">${imgs_html}</div>
</div>`;
        marker.bindPopup(popupContent);
        marker.addTo(this.map);
    }

    load_day(date, day_data){
        let road_positions = [];
        this.bounds = new L.LatLngBounds();
        let prev_coord = null;
        for (let data of day_data) {
            road_positions.push(data.pos);
            this.create_marker(date, data);
        }
        let routing = L.Routing.control({
            createMarker: ()=>null,
            waypoints: road_positions,
            autoRoute: false,
            addWaypoints: false,
            draggableWaypoints: false,
            plan: null
        }).addTo(this.map);
        routing._container.style.display='none';
        routing.route();
        this.map.fitBounds(this.bounds);
    }

    initMap(all_data){
        this.load_day(...Object.entries(all_data)[0]);
    }

    createCarousel(){
        creat
    }
};

module.exports = MapGenerator;
