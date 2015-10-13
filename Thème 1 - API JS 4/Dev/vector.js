var map, mapView, vectorLayer, vectorLayerView;

require([
    "esri/config",
    "esri/Map",
    "esri/views/SceneView",
    "esri/views/MapView",
    "esri/layers/VectorTiledLayer",

    "dojo/domReady!"
],
function(esriConfig, Map, SceneView, MapView, VectorTiledLayer) {

    esriConfig.request.corsEnabledServers.push('http://vectormaps.esri.com');
    esriConfig.request.corsEnabledServers.push('http://basemapsbeta.arcgis.com');

    //////////////////////
    //
    // Map and view
    //
    //////////////////////

    map = new Map({});  // basemap property is left undefined

    vectorLayer = new VectorTiledLayer({
        url: "http://basemapsbeta.arcgis.com/arcgis/rest/services/World_Basemap/VectorTileServer"
    });
    map.add(vectorLayer);

    vectorLayer.on("layer-view-create", function(evt) {
        vectorLayerView = evt.layerView;
    });


    mapView = new MapView({
        container: "mapViewDiv",
        map: map,
        center: [-40, 40],
        zoom: 3
    });





    //////////////////////
    //
    // Defining alternative styles
    //
    //////////////////////

    var styles = {
        'streets': 'http://basemapsbeta.arcgis.com/arcgis/rest/services/World_Basemap/VectorTileServer/styles?f=json',
        'streets-relief': 'http://basemapsbeta.arcgis.com/preview/styles/StreetMapRelief/data.json?f=json',
        'streets-mobile': 'http://basemapsbeta.arcgis.com/preview/styles/StreetMapMobile/data.json?f=json',
        'streets-night': 'http://basemapsbeta.arcgis.com/preview/styles/StreetMapNight/data.json?f=json',
        'canvas-light': 'http://basemapsbeta.arcgis.com/preview/styles/CanvasLight/data.json?f=json',
        'canvas-dark': 'http://basemapsbeta.arcgis.com/preview/styles/CanvasDark/data.json?f=json'
    };

    var listFillGreen = [
        "admin1_park",
        "admin_0_forest;_admin_0_park",
        "open_space",
        "cemetery",
        "golf_course_SL1",
        "zoo",
        "park",
        "landscape_ipc_forest;_ipc_garden_path-conflicted;_ipc_green_urban_area;_ivy___groundcover;_planter_SLD0",
        "landscape_grass_SLD1",
        "landscape_dirt;_gravel;_mulch;_rock;_sand_SLD2",
        "sports_football_field;_soccer_field;_sports_turf;_tennis_court_exterior;_tennis_court_interior;_track_-_grass_SLD0",
        "sports_baseball_field;_softball_field_SL1_SLD1",
        "sports_golf_fairway_SLD2",
        "sports_golf_sand_trap_SLD3",
        "sports_golf_putting_green___teeing_ground_SL1_SLD4",
        "sports_athletic_track;_track_-_clay_or_dirt_SLD6",
        "sports_hardcourt_SL1_SLD7"
    ];
    var listFillGreenBak = [];  // backup

    var listRoadLine = [
        "road_centerlines_freeway_motorway;_highway_major_road_SL0_SLD17",
        "road_centerlines_(tunnels)_freeway_motorway;_highway_major_road_SL0_SLD17"
    ];
    var listRoadLineBak = [];

    var listBuilding = [
        "building_footprint_SL1",
        "building_footprint_SL0"
    ];
    var listBuildingBak = [];






    //////////////////////
    //
    // Dynamically changing the style
    //
    //////////////////////

    // Using jQuery here for UI handlers, can also use dojoBootstrap (http://xsokev.github.io/Dojo-Bootstrap/index.html)


    $(".changeStyle").on("click", function changeStyle(evt) {
        var newUrl = styles[evt.target.id];
        vectorLayer.styleUrl = newUrl;

        $("#toogleButtons .btn-success").each(function() {
            $(this).removeClass("btn-success");
        });
        listFillGreenBak = [];
        listBuildingBak = [];
        listRoadLineBak = [];
    });


        // getPaintProperty returns an array : [0.13725490196078433, 0.5647058823529412, 0.13725490196078433, 1]
        // setPaintProperty expects an rgba string : rgba(35, 144, 35, 1)
    function getRgbaString(paintProperty) {
        return "rgba(" + 
            (paintProperty[0] * 255) + "," +
            (paintProperty[1] * 255) + "," +
            (paintProperty[2] * 255) + "," +
            paintProperty[3] + ")";
    }


    $("#showParks").on("click", function() {
        $(this).toggleClass("btn-success");
        var enabled = $(this).hasClass('btn-success');

        listFillGreen.forEach(function(id, i) {
            if (enabled) {
                listFillGreenBak.push(vectorLayerView.gl.getPaintProperty(id, "fill-color"));
                vectorLayerView.gl.setPaintProperty(id, "fill-color", "rgba(35, 144, 35, 1)");

            } else {
                vectorLayerView.gl.setPaintProperty(id, "fill-color", getRgbaString(listFillGreenBak[i]));
            }
        });

        if (!enabled) {
            listFillGreenBak = [];
        }

    });


    $("#showHighways").on("click", function() {
        // change color to green on click
        $(this).toggleClass("btn-success");
        // check if green is here : hand crafted tooglebutton
        var enabled = $(this).hasClass('btn-success');
        listRoadLine.forEach(function(id, i) {
            if (enabled) {
                // if button enabled, backup old value then change parks color
                listRoadLineBak.push(vectorLayerView.gl.getPaintProperty(id, "line-color"));
                vectorLayerView.gl.setPaintProperty(id, "line-color", "#30588D");

            } else {
                // put back backup value
                vectorLayerView.gl.setPaintProperty(id, "line-color", getRgbaString(listRoadLineBak[i]));
            }
        });

        // if disabling : reinit backup array
        if (!enabled) {
            listRoadLineBak = [];
        }
    });


    $("#hideBuilding").on("click", function() {
        listBuilding.forEach(function(id) {
            vectorLayerView.gl.setLayoutProperty(id, "visibility", "none");
        });
    });


}); 

