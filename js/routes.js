var Routes = function (mapId) {
    this.locations = [];
    this.routes = [];
    this.map = L.map(mapId);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
    }).addTo(this.map);
};

Routes.prototype.addRouteFromFile = function (file) {
    var reader = new FileReader();
    var base = this;
    reader.onload = function (e) {
        var contents = e.target.result;
        var input = document.getElementById('file-input');
        var name = input.files[0].name;
        layer = base.addGpx(contents);
        var list = document.getElementById('route-list');
        var item = document.createElement('LI');
        var text = document.createTextNode(name);
        var box = document.createElement('INPUT');
        box.type = 'checkbox';
        box.checked = true;
        box.value = base.routes.length;
        box.onchange = toggleRoute;
        item.appendChild(box);
        item.appendChild(text);
        list.appendChild(item);
        base.routes.push(new Route(name, layer));
    };
    reader.readAsText(file);
}
Routes.prototype.addGpx = function (gpxData) {
    var base = this;
    var elt = document.getElementById('map-data')

    function _t(t) {
        return elt.getElementsByTagName(t)[0];
    }

    function _c(c) {
        return elt.getElementsByClassName(c)[0];
    }
    var newColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
    layer = new L.GPX(gpxData, {
        async: true
        , polyline_options: {
            color: newColor
        }
        , marker_options: {
            startIconUrl: 'http://github.com/mpetazzoni/leaflet-gpx/raw/master/pin-icon-start.png'
            , endIconUrl: 'http://github.com/mpetazzoni/leaflet-gpx/raw/master/pin-icon-end.png'
            , shadowUrl: 'http://github.com/mpetazzoni/leaflet-gpx/raw/master/pin-shadow.png'
        , }
    , }).on('loaded', function (e) {
        var gpx = e.target;
        base.map.fitBounds(gpx.getBounds());
    }).addTo(this.map);
    return layer;
};
var Route = function (name, layer) {
    this.name = name;
    this.layer = layer;
};
var Location = function (name) {
    this.name = name;
    this.routes = [];
};
