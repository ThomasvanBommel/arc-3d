/*
 * File: main.js
 * Created: Thursday April 8th 2021
 * Author: Thomas vanBommel
 * 
 * Last Modified: Thursday April 8th 2021 3:11pm
 */

let cur_x, cur_y, cur_z; // Cursor x, y, z
let cen_x, cen_y; // Center x, y, z
let zoom;

require([ "esri/Map", "esri/views/SceneView", "esri/geometry/support/webMercatorUtils", 
          "esri/widgets/Home", "esri/widgets/BasemapToggle", "esri/layers/FeatureLayer",
          "esri/widgets/LayerList", "esri/widgets/DirectLineMeasurement3D"
    ], function(Map, SceneView, webMercatorUtils, Home, BasemapToggle, FeatureLayer, LayerList, DirectLineMeasurement3D) {
    
    // Create the map
    var map = new Map({
        basemap: "hybrid",
        ground: "world-elevation"
    });

    // Create the maps view
    var view = new SceneView({
        center: [-63.673, 44.611],
        container: "map",
        map: map,
        zoom: 10
    });


    // Add ui to the map
    view.ui.add(new Home({ view: view }), "top-left");
    view.ui.add(new BasemapToggle({ view: view, nextBasemap: "topo-vector" }), "bottom-right");
    view.ui.add(new DirectLineMeasurement3D({ view: view }), "top-right");
    view.ui.add(new LayerList({
        view: view,
        listItemCreatedFunction: event => event.item.panel = {
            content: "legend",
            open: true
        }
    }), "bottom-left");

    // Add feature layer
    map.add(createFeatureLayer(FeatureLayer));

    // Get elements
    cur_x = document.querySelector("#cur_x");
    cur_y = document.querySelector("#cur_y");
    cur_z = document.querySelector("#cur_z");
    cen_x = document.querySelector("#cen_x");
    cen_y = document.querySelector("#cen_y");
    zoom  = document.querySelector("#zoom");

    // Update cursor position (cur_x, cur_y)
    view.on("pointer-move", event => {
        const position = webMercatorUtils.webMercatorToGeographic(
            view.toMap({ x: event.x, y: event.y }) ?? { x: 0, y: 0, z: 0 }
        );

        cur_x.innerText = position.x.toFixed(3);
        cur_y.innerText = position.y.toFixed(3);
        cur_z.innerText = position.z.toFixed(3);
    });

    // Update center position (cen_x, cen_y)
    const updateCenterCoord = event => {
        const position = webMercatorUtils.webMercatorToGeographic(
            view.center
        );

        cen_x.innerText = position.x.toFixed(3);
        cen_y.innerText = position.y.toFixed(3);
    }

    // Events to update center position on
    view.on("double-click", updateCenterCoord);
    view.on("mouse-wheel", updateCenterCoord);
    view.on("resize", updateCenterCoord);
    view.on("click", updateCenterCoord);
    view.on("drag", updateCenterCoord);

    // Update zoom level
    const updateZoomLevel = event => {
        zoom.innerText = view.zoom.toFixed(3);
    };

    updateZoomLevel();

    // Events to update zoom on
    view.on("double-click", updateZoomLevel);
    view.on("mouse-wheel", updateZoomLevel);
    view.on("resize", updateZoomLevel);

    // setInterval(() => {
    // }, 1000)
});

// Create boat facillity feature layer
function createFeatureLayer(FeatureLayer){
    return new FeatureLayer({
        url: "https://services2.arcgis.com/11XBiaBYA9Ep0yNJ/arcgis/rest/services/Boat_Facilities/FeatureServer/0/query?outFields=*&where=1%3D1",
        popupTemplate: {
            title: "Boat Facillity {OBJECTID}",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "ASSETID",
                            label: "ID"
                        }, {
                            fieldName: "MAT",
                            label: "Material"
                        }, {
                            fieldName: "LOCATION",
                            label: "Location"
                        }, {
                            fieldName: "MODDATE",
                            label: "Updated"
                        }
                    ]
                }
            ]
        },
        renderer: {
            type: "unique-value",
            field: "MAT",
            defaultSymbol: { 
                type: "simple-marker",
                color: "#ff00ff"
            },
            uniqueValueInfos: [
                {
                    value: "WOOD",
                    symbol: {
                        type: "simple-marker",
                        color: "#964B00"
                    }
                }, {
                    value: "CONC",
                    symbol: {
                        type: "simple-marker",
                        color: "gray"
                    }
                }, {
                    value: "NATU",
                    symbol: {
                        type: "simple-marker",
                        color: "green"
                    }
                }, {
                    value: "UNKN",
                    symbol: {
                        type: "simple-marker",
                        color: "light-gray"
                    }
                }
            ]
        }
    });
}