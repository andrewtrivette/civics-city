<div class="col-12 mt-4 text-center">
    <h2>Cycling Paths</h2>
</div>
<div class="col-12 col-lg-4 mt-4">
    <div class="block">
        <div class="title">Filters</div>
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" id="incidentAll" name="incidentType" type="checkbox" bind:group={incidentType} value={"all"} checked on:change={updateMap} />
                <label class="form-check-label" for="incidentAll">All Bike Infrastructure</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input bg-vru" name="incidentType" id="incidentVRU" type="checkbox" bind:group={incidentType} value={"vru"} on:change={updateMap} />
                <label class="form-check-label" for="incidentVRU"><abbr title="All Ages and Abilities">AAA</abbr> Infrastructure</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input bg-cars" name="incidentType" id="incidentCars" type="checkbox" bind:group={incidentType} value={"cars"} on:change={updateMap}  />
                <label class="form-check-label" for="incidentCars">Dedicated Bike Paths</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input bg-cars" name="incidentType" id="futureRoutes" type="checkbox"  />
                <label class="form-check-label" for="futureRoutes">Future Infrastructure</label>
            </div>
        </div>
        <!-- <div class="content">
            <select class="form-select" name="incidentCouncil" bind:value={councilDistrict} on:change={updateMap}>
                <option value={""} selected>All Council Districts</option>
                {#each councilDistricts as item (item.id) }
                    <option value={item.id}>{item.name.replace('City Council ', '')}</option>
                {/each}
            </select>
        </div> -->
    </div>
    <p><small>Updated Daily</small></p>
    <p><small>Source: <a href="https://openstreetmaps.org" target="_blank">OpenStreetMap</a></small></p>
</div>
<div class="col-12 col-lg-8 my-4">
    <div id="map1" class="map-tall" on:blur={mapBlur} on:focus={mapFocus}></div>
    
</div>
<div class="col-12">
    <hr />
</div>


<style>
    #map1 {
        height: 350px;
    }
    #map1.map-tall {
        height: 800px;
    }
    .bg-cars {
        background-color: rgba(54, 162, 235, 1);
    }
    .bg-vru {
        background-color: rgba(255, 99, 132, 1);
    }
</style>

<script>
    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';

    import 'leaflet/dist/leaflet.css';
    import { browser } from "$app/env";
    import * as turf from '@turf/turf';

    let domain = 'https://civics.city/atlanta/data';
    let incidents = {};
    let incidentsGroup = null
    let councilDistricts = [];
    let councilGroups = null;
    let councilFeatures = null;

    let map1 = null;
    let councilDistrict = '';
    let minDate = "2022-06-28";
    let maxDate = new Date().toISOString().split('T')[0];
    let incidentType = 'all';
    let incidentCount = 0;

    function isVRU(title) {
        title = title.toLowerCase();
        return ( title.includes('pedestrian') ||
                title.includes('bicyclist') ||
                title.includes('struck by vehicle') ||
                title.includes('bicycle') ||
                title.includes('scooter') );
            
    }

    let updateMap = function() {
        incidentsGroup.eachLayer((layer) => {
            layer.remove();
        });
        councilGroups.eachLayer((layer) => {
            console.log(layer);
            layer.remove();
        });
        let tempCouncilGeoJSON = councilFeatures;
        // if( councilDistrict != '' )
        // {
        //     tempCouncilGeoJSON = councilFeatures.features.filter((feature) => {
        //         return feature.properties.NAME == councilDistrict
        //     });
        // }
        let districts = L.geoJSON(tempCouncilGeoJSON, {
            style: function (feature) {
                return {color: 'rgba(255,0,255,0.3)', fillOpacity: 0.2};
            }
        }).addTo(map1);
        councilGroups.addLayer(districts);

        // map1.fitBounds( districts.getBounds(), { padding: [ 30, 30]} );

        // var tempIncidents = incidents['Traffic Related'];
        // Object.keys(filters).forEach(filter => {
        //     tempIncidents = tempIncidents.filter(item => {
        //         return filters[filter](item);
        //     })
        // })
        // incidentCount = tempIncidents.length;
        // tempIncidents.forEach((incident) => {
        //     var title = incident.title.toLowerCase();

        //     var marker = L.circle(incident.location, {
        //         color: 'transparent',
        //         fillColor: !isVRU(title) ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
        //         fillOpacity: 1,
        //         radius: 100
        //     }).addTo(map1);
        //     incidentsGroup.addLayer(marker);
        //     var d = new Date(incident.time).toLocaleString('en-us');
        //     marker.bindPopup(`<div><b>${incident.title}</b><br>${d}<br/><a href="https://citizen.com/${incident.key}" target="_blank">Additional Details</a></div>`);
        // })
        
    }

    let filters = {
        incidentType: function( item )
        {
            if( incidentType == 'all' )  { return true; }
            if( incidentType == 'cars' ) { return !isVRU(item.title); }
            if( incidentType == 'vru' ) { return isVRU(item.title); }
        },
        incidentDateStart: function( item )
        {
            var d = new Date(item.time);
            var startDate = new Date(minDate);
            return ( d >= startDate ) ? true : false;
        },
        incidentDateEnd: function( item )
        {
            var d = new Date(item.time);
            var endDate = new Date(maxDate);
            return ( d < endDate ) ? true : false;
        },
        councilDistricts: function( item )
        {
            var include = true;
            if( councilDistrict != '' )
            {
                var feature = councilFeatures.features.filter((feature) => {
                    return feature.properties.NAME == councilDistrict
                });
                var pt = turf.point([item.location[1], item.location[0]]);
                include = turf.booleanPointInPolygon(pt, feature[0])
            }
            return include            
        },
        excluded: function( item )
        {
            return !item.title.toLowerCase().includes('unfounded');
        }
    }

    function mapFocus() { map1.scrollWheelZoom.enable(); }
    function mapBlur() { map1.scrollWheelZoom.disable(); }


    onMount( async () => {
        if( browser ) {
            var accessToken = 'pk.eyJ1IjoiYWR0cml2ZXR0ZSIsImEiOiJja3hqcm10bmUwc3hzMnZwZXRiajNydHk3In0.70J9PWirbAZ71d6vwcRXvg';
            var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + accessToken, {
                attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                tileSize: 512,
                zoomOffset: -1
            });
            map1 = L.map('map1', {
                attributionControl: true,
                zoomControl: true,
                gestureHandling: true,
                dragging: true,
                zoomSnap: 0,
                zoomDelta: 0.5,
                // minZoom: 11,
                // maxZoom: 15
            })
            .addLayer(mapboxTiles)
            .setView([33.776, -84.42], 12);
            councilGroups = L.layerGroup();
            incidentsGroup = L.layerGroup();
            
            
            get( domain+'/osm_data.geojson', function(councilGeoJSON) 
            {
                councilFeatures = councilGeoJSON;
                var districts = L.geoJSON(councilGeoJSON, {
                    style: function (feature) {
                        return {color: 'rgba(255,0,255,.5)', fillOpacity: 0.2};
                    },
                    onEachFeature: function(feature, layer) {
                        console.log(feature.properties);
                        var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                            return (['id', 'ref'].indexOf(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                        }, '');
                        console.log('<table>'+properties+'</table>');
                        layer.bindPopup('<table>'+properties+'</table>')
                    },
                    filter: function(feature) {
                        return feature?.properties?.network != 'ncn' && feature?.properties?.network != 'rcn'
                    }
                }).addTo(map1);
                councilGroups.addLayer(districts);

                // map1.fitBounds( districts.getBounds(), { padding: [ 30, 30]} );

                councilDistricts = councilGeoJSON.features.map(function(feature, index) {
                    return {
                        id: feature.properties.NAME,
                        name: feature.properties.GEOTYPE + ' ' + feature.properties.NAME
                    }
                });
                councilDistricts = councilDistricts.sort((a, b) => {
                    return parseInt(a.id) > parseInt(b.id) ? 1: -1;
                })
                
                // map.sexMaxBounds( mapLayers['districts'].getBounds())
            });
        }
    });
</script>
 