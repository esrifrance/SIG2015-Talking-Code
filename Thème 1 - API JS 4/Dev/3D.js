// These variables are declared in the global scope,
// to let you play with them from the console.

var map, snowLayer, tracksLayer, liftsLayer, queueLayer, sceneView, defaultSnowRenderer,
objectSymbolRenderer, defaultPointRenderer;

require([
    "esri/config",
    "esri/Map",
    "esri/views/SceneView",
    "esri/Camera",

    "esri/layers/FeatureLayer",
    "esri/layers/SceneLayer",
    "esri/Basemap",

    "dojo/_base/Color",
    "esri/renderers/SimpleRenderer",

    "esri/symbols/PolygonSymbol3D",
    "esri/symbols/ExtrudeSymbol3DLayer",
    "esri/symbols/PointSymbol3D",
    "esri/symbols/MeshSymbol3D",

    "esri/symbols/IconSymbol3DLayer",
    "esri/symbols/ObjectSymbol3DLayer",
    "esri/symbols/FillSymbol3DLayer",

    "dojo/domReady!"
],
function(esriConfig, Map, SceneView, Camera,
         FeatureLayer, SceneLayer, Basemap,
         Color, SimpleRenderer,
         PolygonSymbol3D, ExtrudeSymbol3DLayer, PointSymbol3D, MeshSymbol3D,
         IconSymbol3DLayer, ObjectSymbol3DLayer, FillSymbol3DLayer) {

             esriConfig.request.corsEnabledServers.push('http://vectormaps.esri.com');
             esriConfig.request.corsEnabledServers.push('http://coolmaps.esri.com');
             esriConfig.request.corsEnabledServers.push('http://basemapsbeta.arcgis.com');
             esriConfig.request.corsEnabledServers.push('http://sd-76657.dedibox.fr');





             //////////////////////
             //
             // Map and view
             //
             //////////////////////

             map = new Map({
                 basemap: "hybrid"
             });

             snowLayer = new FeatureLayer({
                 url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/2",
                 opacity: 0.6
             });

             liftsLayer = new FeatureLayer({
                 url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/0"
             });

             tracksLayer = new FeatureLayer({
                 url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/1"
             });

             queueLayer = new FeatureLayer({
                 url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski2/FeatureServer/0",
                 opacity: 1,
                 outFields: ["*"]
             });
             var sceneLayer = new SceneLayer({
                 url: "http://sd-76657.dedibox.fr:6080/arcgis/rest/services/Hosted/MP_Batiments_Final/SceneServer/layers/0/",
                 visible: false
             });

             map.add([snowLayer, liftsLayer, tracksLayer, queueLayer, sceneLayer]);



             sceneView = new SceneView({
                 container: "mapViewDiv",
                 map: map
             });










             //////////////////////
             //
             // Moving the camera around
             //
             //////////////////////


             // Using jQuery here for UI handlers, can also use dojoBootstrap (http://xsokev.github.io/Dojo-Bootstrap/index.html)

             //
             // Going to Chamrousse : only camera movement
             //

             $("#goChamrousse").on("click", function(evt) {
                 // jshint unused:false

                 var chamrousseCamera = Camera.fromJSON({
                     "position": {
                         "x": 641437.6110656856,
                         "y": 5641777.451070604,
                         "z": 4026.7193905217573,
                         "spatialReference": {
                             "wkid": 102100
                         }
                     },
                     "heading": 98.14635195686014,
                     "tilt": 76.32825263878885
                 });

                 sceneView.animateTo(chamrousseCamera);
             });



             //
             // Going to Versailles : calling in a scene layer besides moving the camera
             //

             $("#goVersailles").on("click", function(evt) {
                 // jshint unused:false

                 var versaillesCamera = Camera.fromJSON({
                     "position": {
                         "x": 237456.54132543874,
                         "y": 6236741.59717391,
                         "spatialReference": {
                             "wkid": 102100
                         },
                         "z": 1510.6054758718237
                     },
                     "heading": 347.57418061780675,
                     "tilt": 66.9354994103115
                 });

                 sceneView.animateTo(versaillesCamera);

                 // Removing the basemap's elevation, to avoid bugs with the scene layer's data
                 // in this early beta API.
                 map.basemap.elevationLayers.clear();

                 var versaillesSymbol = new MeshSymbol3D(
                     new FillSymbol3DLayer({
                     material: { color: "#d1e1ee" }
                 }));

                 sceneLayer.renderer = new SimpleRenderer(versaillesSymbol);
                 sceneLayer.visible = true;
             });




             //////////////////////
             //
             // 3D Symbology
             //
             //////////////////////


             $("#extrudeSnow").on("click", function(evt) {
                 // jshint unused:false

                 // beta : on the fly modifications on the class break renderer don't seem to work yet

                 $(this).toggleClass("btn-success");

                 if (defaultSnowRenderer) {
                     snowLayer.renderer = defaultSnowRenderer;
                     defaultSnowRenderer = null;
                 } else {
                     defaultSnowRenderer = snowLayer.renderer;
                     var snow3DRenderer = new SimpleRenderer({
                         symbol: new PolygonSymbol3D({
                             symbolLayers: [new ExtrudeSymbol3DLayer()]
                         }),
                         visualVariables: [{
                             type: "sizeInfo",
                             field: "height",
                             minDataValue: 0,
                             maxDataValue: 300,
                             minSize: 0,
                             maxSize: 400
                         }, {
                             type: "colorInfo",
                             field: "height",
                             minDataValue: 0,
                             maxDataValue: 300,
                             colors: [new Color("white"), new Color("10DDF0")]
                         }]
                     });

                     snowLayer.renderer = snow3DRenderer;
                 }
             });




             $("#activatePoints").on("click", function(evt) {
                 // jshint unused:false
                 $(this).toggleClass("btn-success");
                 $("#changeTime").toggleClass("hidden");
                 if (defaultPointRenderer) {
                     queueLayer.renderer = defaultPointRenderer;
                     defaultPointRenderer = null;

                 } else {
                     defaultPointRenderer = queueLayer.renderer;


                     objectSymbolRenderer = new SimpleRenderer({
                         symbol: new PointSymbol3D({
                             symbolLayers: [
                                 new ObjectSymbol3DLayer ({
                                     resource: {
                                         primitive: "cylinder"
                                     },
                                     material: {
                                         color: "#FFD700"
                                     }
                                 })
                             ]
                         }),
                         visualVariables: [{
                             type: "sizeInfo",
                             field: "personnes9h",
                             minDataValue: 0,
                             maxDataValue: 500,
                             minSize: 30,
                             maxSize: 500
                         }, {
                             type: "colorInfo",
                             field: "personnes9h",
                             minDataValue: 0,
                             maxDataValue: 500,
                             colors: [new Color("green"), new Color("10DDF0")]
                         }]
                     });

                     queueLayer.renderer = objectSymbolRenderer;
                 }
             });


             $("#changeTime").on("click", function(/* evt */) {
                 $(this).toggleClass("btn-warning");

                 if ($(this).hasClass("btn-warning")) {
                     $(this).text("Après Midi");
                     var objectSymbolRenderer2 = new SimpleRenderer({
                         symbol: new PointSymbol3D({
                             symbolLayers: [new ObjectSymbol3DLayer({
                                 resource: {
                                     primitive: "cylinder"
                                 },
                                 material: {
                                     color: "#FFD700"
                                 }
                             }
                           )]
                         }),
                         visualVariables: [{
                             type: "sizeInfo",
                             field: "personnes14h",
                             minDataValue: 0,
                             maxDataValue: 500,
                             minSize: 30,
                             maxSize: 500
                         }, {
                             type: "colorInfo",
                             field: "personnes14h",
                             minDataValue: 0,
                             maxDataValue: 500,
                             colors: [new Color("green"), new Color("10DDF0")]
                         }]
                     });
                     queueLayer.renderer = objectSymbolRenderer2;
                 } else {
                     $(this).text("Matin");
                     queueLayer.renderer = objectSymbolRenderer;
                 }


             });

         });
