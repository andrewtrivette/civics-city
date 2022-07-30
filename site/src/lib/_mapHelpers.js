import { get } from "$lib/_helpers";

export default class MapHelper {

    updateMap( layers ) {
        // Remove all existing layerGroups from map
        Object.keys(layers).forEach((layerKey) => {
            if( layers[layerKey].layerGroup ) {
                layers[layerKey].layerGroup.eachLayer((layer) => {
                    layer.remove();
                });
            }
        })

        // Loop through layers, filter their datasets based on the current active variables, and add the filtered datasets back to the map
        Object.entries( layers ).forEach(([key, layer]) => {
            let dataset = layer.dataset;
            var tempDataset = Object.assign({}, dataset);
            if( layers.hasOwnProperty(key) && layers[key].hasOwnProperty('filters') && layers[key].filters.length > 0 ) {
                layers[key].filters.forEach(filter => {
                    tempDataset = filter(tempDataset);
                })
            }
            tempDataset.features.sort((a, b) => {
                return b.properties.time - a.properties.time
            })
            layers[key].tempDataset = tempDataset;
            let features = L.geoJSON(tempDataset, layers[key].featureOpts).addTo(this.map);
            layers[key].layerGroup.addLayer(features);
            if( Object.keys(features._layers).length > 0 && layers[key].bounds == true ) {
                this.map.fitBounds( features.getBounds(), { padding: [ 30, 30]} );
            }
        });
        return layers;
    }

    async initMapLayers(layers, mapEl) {
        const L = await import('leaflet');
        const { GestureHandling } = await import('leaflet-gesture-handling') 

        var accessToken = 'pk.eyJ1IjoiYWR0cml2ZXR0ZSIsImEiOiJja3hqcm10bmUwc3hzMnZwZXRiajNydHk3In0.70J9PWirbAZ71d6vwcRXvg';
        var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + accessToken, {
            attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            tileSize: 512,
            zoomOffset: -1
        });
        this.map = L.map(mapEl, {
            attributionControl: true,
            zoomControl: true,
            gestureHandling: true,
            dragging: true,
            zoomSnap: 0,
            zoomDelta: 0.5
        })
        .addLayer(mapboxTiles)
        .setView([33.776, -84.42], 12);
        let promises = [];
        Object.entries(layers).forEach(([key, layer]) => {
            promises.push(new Promise((resolve, reject) => {
                get( layer.source, function(geoJSON) 
                {
                    if( layer.hasOwnProperty('sourceCallback') ) {
                        geoJSON = layer.sourceCallback(geoJSON)
                    }
                    layers[key].dataset = geoJSON;
                    layers[key].layerGroup = L.layerGroup();
                    
                    resolve();
                });
            }));
        })
        return Promise.all( promises ).then((data) => {
           return this.updateMap(layers, this.map);
        });
    }
}