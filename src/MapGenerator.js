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

    create_marker(data){
        let marker = new L.Marker(data.pos);
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
        for (let img_name of image_path) {
            imgs_html += '<div><img width="185" height="185" src="'+data.dir_path+img_name+'"></div>';
        }
        let popupContent = `
<div class="popup">
    <div class="event_title" style="background-color: ">`+data.description+`</div>
    <div class="img_frame_container">`+imgs_html+`</div>
</div>`;
        marker.bindPopup(popupContent);
        marker.addTo(this.map);
    }

    load_day(day_data){
        let road_positions = [];
        for (let data of day_data) {
            this.create_marker(day_data);
        }
    }

    initMap(all_data){
        this.load_day(Object.values(all_data)[0]);
    }
};

module.exports = MapGenerator;
