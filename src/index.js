window.$ = window.jQuery = require("jquery");
require("bootstrap");
let MapGenerator = require("./MapGenerator.js");
let all_data = require("./data.js");
let mapGenerator = new MapGenerator("map_id");
mapGenerator.initMap(all_data);
