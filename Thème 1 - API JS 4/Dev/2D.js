// These variables are declared in the global scope,
// to let you play with them from the console.

var map, snowLayer, tracksLayer, liftsLayer, mapView, esriBasemap, customBasemap, tonerLabelsLayer;

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/Extent",
    "esri/Basemap",

    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISElevationLayer",
    "esri/layers/WebTiledLayer",

    "dojo/domReady!"
],
function(esriConfig, Map, MapView, Extent, Basemap,
         FeatureLayer, ArcGISElevationLayer, WebTiledLayer) {

         esriConfig.request.corsEnabledServers.push('http://vectormaps.esri.com');
         esriConfig.request.corsEnabledServers.push('http://coolmaps.esri.com');
         esriConfig.request.corsEnabledServers.push('http://basemapsbeta.arcgis.com');


         //////////////////////
         //
         // Choosing an Esri basemap + defining a custom base map
         //
         //////////////////////

         esriBasemap = "satellite";

         // subdomains for the WebTile services
         var subDomains = ['a','b','c','d'];

         // base layer
         var tonerBackgroundLayer = new WebTiledLayer({
             urlTemplate: 'http://${subDomain}.tile.stamen.com/toner-background/${level}/${col}/${row}.png',
             subDomains: subDomains
         });

         // reference layer
         tonerLabelsLayer = new WebTiledLayer({
             urlTemplate: 'http://${subDomain}.tile.stamen.com/toner-labels/${level}/${col}/${row}.png',
             subDomains: subDomains
         });

         // Toner Basemap
         customBasemap = new Basemap({
             title: "Toner",
             baseLayers: [tonerBackgroundLayer],
             referenceLayers: []
         });


         //////////////////////
         //
         // Map and view
         //
         //////////////////////

         map = new Map({
             basemap: esriBasemap
         });

         snowLayer = new FeatureLayer({
             url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/2",
             opacity: 0.6
         });

         tracksLayer = new FeatureLayer({
             url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/1"
         });

         liftsLayer = new FeatureLayer({
             url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/0"
         });

         map.add([snowLayer, liftsLayer, tracksLayer]);



         mapView = new MapView({
             container: "mapViewDiv",
             map: map,
             extent: {"xmin":-17262783.18085816,"ymin":-5624876.300927432,"xmax":10914962.926181722,"ymax":13375534.442083487,"spatialReference":{"wkid":102100}}
         });


         // Use jQuery here for UI handlers, can also use dojoBootstrap (http://xsokev.github.io/Dojo-Bootstrap/index.html)


         $("#goChamrousse").on("click", function(/* evt */) {
             var chamrousseExtent = Extent.fromJSON({
                 "xmin":642915.5523099306,
                 "ymin":5631173.601944849,
                 "xmax":662445.2130367667,
                 "ymax":5645658.418804871,
                 "spatialReference":{"wkid":102100}
             });

             mapView.animateTo(chamrousseExtent);
         });


         $("#labelling").on("click", function(/* evt */) {
             $(this).toggleClass("btn-success");

             if(customBasemap.referenceLayers.length) {
                 customBasemap.referenceLayers = [];
             } else {
                 customBasemap.referenceLayers = [tonerLabelsLayer];
             }
         });

         $("#toggleBasemap").on("click", function(/* evt */) {
             $(this).toggleClass("btn-success");
             $("#labelling").toggleClass("hidden");

             if(map.basemap.id === esriBasemap) {
                 map.basemap = customBasemap;
             } else {
                 map.basemap = esriBasemap;
             }
         });

     });
