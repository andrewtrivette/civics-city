<div class="col-12 col-lg-3 mt-4">
    <div class="block">
        <div class="title">Existing Bike Lanes</div>
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" name="laneType" id="protectedLanes" type="checkbox" bind:group={layers.lanes.active} value={"protected"} on:change={updateMap}  />
                <label class="form-check-label" for="protectedLanes">Protected Bike Lanes</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="laneType" id="unprotectedLanes" type="checkbox" bind:group={layers.lanes.active} value={"unprotected"} on:change={updateMap}  />
                <label class="form-check-label" for="unprotectedLanes">Unprotected Bike Lanes</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="laneType" id="currentPaths" type="checkbox" bind:group={layers.lanes.active} value={"paths"} on:change={updateMap} />
                <label class="form-check-label" for="currentPaths">Non-road Paths</label>
            </div>
        </div>
    </div>
    <div class="block">
        <div class="title">Planned Bike Lanes</div>
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" name="projectType" id="projectAccessibility" type="checkbox" bind:group={layers.projects.active} value={"complete"} on:change={updateMap}  />
                <label class="form-check-label" for="projectAccessibility">Complete Streets</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="projectType" id="projectTrails" type="checkbox" bind:group={layers.projects.active} value={"trails"} on:change={updateMap}  />
                <label class="form-check-label" for="projectTrails">Multi-use Trails</label>
            </div>
        </div>
    </div>
    <div class="block">
        <div class="title">Council Districts</div>
        <div class="content">
            <select class="form-select" name="incidentCouncil" bind:value={layers.districts.active} on:change={updateMap}>
                <option value={"all"} selected>All Council Districts</option>
                {#each [...Array(12).keys()] as item }
                    <option value={item+1}>District {item+1}</option>
                {/each}
            </select>
        </div>
    </div>
</div>
<div class="col-12 col-lg-9 my-4">
    <div bind:this={mapEl} class="map"></div>
</div>
<div class="col-12">
    <hr />
</div>


<style>
    .map {
        height: 800px;
    }
</style>

<script>
    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';

    import 'leaflet/dist/leaflet.css';
    import { browser } from "$app/env";

    let domain = 'https://civics.city/atlanta/data';
    let mapEl = null;
    let map = null;

    let layers = {
        districts: {
            source: domain+'/council-districts-simplified.geojson',
            // sourceCallback: (geoJSON) => {

            // },
            dataset: null,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(255,0,255,.5)', fillOpacity: 0.1};
                }
            },
            active: 'all',
            filters: [
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        return ( layers.districts.active == 'all' ) ? false : item.properties.NAME == layers.districts.active
                    });
                    return dataset;
                }
            ]
        },
        cityLimits: {
            source: domain+'/atl-city-limits.geojson',
            dataset: null,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(255,0,255,.5)', fillOpacity: 0.1};
                }
            },
            filters: [
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        return ( layers.districts.active == 'all' ) ? true : false
                    });
                    return dataset;
                }
            ]
        },
        lanes: {
            source: domain+'/atldot-bike-lanes.geojson',
            dataset: null,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(255,255,0,.5)', fillOpacity: 0.2};
                },
                onEachFeature: function(feature, layer) {
                    var properties = feature.properties
                    console.log(properties.YEAR_INSTALLED)
                    layer.bindPopup(`<div>
                        <h3>${properties.NAME}</h3>
                        <p><b>${properties.LENGTH_MILES.toFixed(2)} ${(properties.PROTECTION == 'High') ? 'protected':'unprotected'} miles</b> of ${properties.FACILITY_TYPE}. Installed in ${properties.YEAR_INSTALLED}</p>
                    </div>`, {maxWidth: 600, className: 'overlay', autoPan: false})
                }
            },
            active: ['protected', 'paths'],
            filters: [
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        var status = item.properties.STATUS;
                        var type = item.properties.FACILITY_TYPE;
                        return ( status == 'Existing' 
                                && type != 'Shared Lane Markings' 
                                && type != 'Sharrows') 
                                ? true : false;
                    })
                    return dataset;
                },
                (dataset) => {
                    
                    dataset.features = dataset.features.filter(item => {
                        var include = false;
                        var protection = item.properties.PROTECTION;
                        var onroad = item.properties.ON_OFFROAD;
                        let laneType = layers.lanes.active;
                        if( laneType.includes('protected') 
                            && protection == 'High' 
                            && onroad == 'On' ) {
                            include = true;
                        }
                        if( laneType.includes('unprotected') 
                            && protection != 'High' 
                            && onroad == 'On' ) {
                            include = true;
                        }
                        if( laneType.includes('paths') 
                            && onroad == 'Off' ) {
                            include = true;
                        }
                        return include;
                    });
                    return dataset;
                }
            ]
        },
        projects: {
            source: domain+'/atldot-active-projects-cycling-pedestrian.geojson',
            dataset: null,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(255,255,255,.5)', fillOpacity: 0.2};
                },
                onEachFeature: function(feature, layer) {
                    var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                        return (['id', 'ref'].indexOf(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                    }, '');
                    layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})
                }
            },
            active: [],
            filters: [
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        var category = item.properties.PROJECT_CATEGORY;
                        var include = false;
                        let projectType = layers.projects.active;
                        if( projectType.includes('complete') 
                            && category.includes('Complete')) { 
                            include = true;
                        }
                        if( projectType.includes('trails') 
                            && category.includes('Trails')) { 
                            include = true;
                        }
                        return include;
                    })
                    return dataset;
                }
            ]
        }
    };


    let updateMap = function() {
        Object.keys(layers).forEach((layerKey) => {
            if( layers[layerKey].layerGroup ) {
                layers[layerKey].layerGroup.eachLayer((layer) => {
                    layer.remove();
                });
            }
        })

        Object.entries( layers ).forEach(([key, layer]) => {
            let dataset = layer.dataset;
            var tempDataset = Object.assign({}, dataset);
            if( layers.hasOwnProperty(key) && layers[key].hasOwnProperty('filters') && layers[key].filters.length > 0 ) {
                layers[key].filters.forEach(filter => {
                    tempDataset = filter(tempDataset);
                })
            }
            let features = L.geoJSON(tempDataset, layers[key].featureOpts).addTo(map);
            layers[key].layerGroup.addLayer(features);
            if( Object.keys(features._layers).length > 0 && !['lanes', 'projects'].includes(key) ) {
                map.fitBounds( features.getBounds(), { padding: [ 30, 30]} );
            }
            
        });
    }

    onMount( async () => {
        if( browser ) {
            var accessToken = 'pk.eyJ1IjoiYWR0cml2ZXR0ZSIsImEiOiJja3hqcm10bmUwc3hzMnZwZXRiajNydHk3In0.70J9PWirbAZ71d6vwcRXvg';
            var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + accessToken, {
                attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                tileSize: 512,
                zoomOffset: -1
            });
            map = L.map(mapEl, {
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
                        layers[key].dataset = geoJSON;
                        layers[key].layerGroup = L.layerGroup();
                        if( layer.hasOwnProperty('sourceCallback') ) {
                            layer.sourceCallback(geoJSON)
                        }
                        resolve();
                    });
                }));
            })
            Promise.all( promises ).then((data) => {
                updateMap();
            });
        }
    });
</script>
 