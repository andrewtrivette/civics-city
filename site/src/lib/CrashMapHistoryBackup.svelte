
<div class="col-12 mt-4 text-center">
    <h2>Crash Heatmap</h2>
</div>
<div class="col-12 col-lg-4 mt-4">
    <div class="block">
        <div class="title">Filters</div>
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" id="incidentAll1" name="incidentType1" type="radio" bind:group={incidentType} value={"all"} checked  on:change={updateMap} />
                <label class="form-check-label" for="incidentAll1">All Incidents</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input bg-vru" name="incidentType1" id="incidentVRU1" type="radio" bind:group={incidentType} value={"vru"} on:change={updateMap} />
                <label class="form-check-label" for="incidentVRU1">Pedestrians & Cyclists</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input bg-cars" name="incidentType1" id="incidentCars1" type="radio" bind:group={incidentType} value={"cars"} on:change={updateMap}  />
                <label class="form-check-label" for="incidentCars1">Cars</label>
            </div>
        </div>
        <div class="content">
            <div class="input-group mb-2">
                <label class="input-group-text" for="incidentYear">Year</label>
                <select class="form-select" name="incidentYear" bind:value={year} on:change={updateYear}>
                    <option value={2021}>2021</option>
                    <option value={2020}>2020</option>
                    <option value={2019}>2019</option>
                    <option value={2018}>2018</option>
                    <option value={2017}>2017</option>
                    <option value={2016}>2016</option>
                    <option value={2015}>2015</option>
                    <option value={2014}>2014</option>
                    <option value={2013}>2013</option>
                </select>
                
            </div>
            <select class="form-select" name="incidentCouncil1" bind:value={councilDistrict} on:change={updateMap}>
                <option value={'all'}>All Council Districts</option>
                {#each councilDistricts as item (item.id) }
                    <option value={item.id}>{item.name.replace('City Council ', '')}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="block">
        <div class="title"># of Incidents</div>
        <div class="content text-center"><h2>{incidentCount.toLocaleString('en-US')}</h2></div>
    </div>
    <div class="block">
        <div class="title">Average Incidents/Day</div>
        <div class="content text-center"><h2>{(incidentCount/365).toFixed(2).toLocaleString('en-US')}</h2></div>
    </div>
    <p><small>Source: <a href="http://www.dot.ga.gov/DS/Crash" target="_blank">GDOT Crash Data</a></small></p>
</div>
<div class="col-12 col-lg-8 my-4">
    <div bind:this={mapEl} class="map"></div>
</div>

<style>
    .map {
        height: 800px;
    }
    /* .bg-cars {
        background-color: rgba(54, 162, 235, 1);
    }
    .bg-vru {
        background-color: rgba(255, 99, 132, 1);
    } */
</style>

<script>
    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';

    import 'leaflet/dist/leaflet.css';
    import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
    import { browser } from "$app/env";
    import * as turf from '@turf/turf';

    let domain = 'https://civics.city/atlanta/data';
    let incidents = {};
    let incidentsGroup = null
    let councilDistricts = [];
    let councilGroups = null;
    let councilFeatures = null;
    let map1 = null;
    let mapEl = null;
    let councilDistrict = 'all';
    let incidentType = 'all';
    let incidentKeys = [];
    let incidentCount = 0;
    let year = 2021;
    let incidentYears = {};
    let heatmap = null;

    function isVRU(atts) {
        var bikeIndex = incidentKeys.findIndex( item => item == 'Bicycle');
        var pedestrianIndex = incidentKeys.findIndex(item => item == 'Pedestrian')
        return ( atts.includes(bikeIndex) ||
                atts.includes(pedestrianIndex) );
            
    }

    function updateMap() {
        incidentsGroup.eachLayer((layer) => {
            layer.remove();
        });
        heatmap.remove();
        councilGroups.eachLayer((layer) => {
            layer.remove();
        });
        let tempCouncilGeoJSON = councilFeatures;
        if( councilDistrict != 'all' )
        {
            tempCouncilGeoJSON = councilFeatures.features.filter((feature) => {
                return feature.properties.NAME == councilDistrict
            })
        }
        let districts = L.geoJSON(tempCouncilGeoJSON, {
            style: function (feature) {
                return {color: 'rgba(255,0,255,.5)', fillOpacity: 0.2};
            }
        }).addTo(map1);
        councilGroups.addLayer(districts);
        console.log(districts.getBounds() )
        map1.fitBounds( districts.getBounds(), { padding: [ 30, 30]} );

        var tempIncidents = incidents;
        Object.keys(filters).forEach(filter => {
            tempIncidents = tempIncidents.filter(item => {
                return filters[filter](item);
            })
        })
        incidentCount = tempIncidents.length;
        
        let dataPoints = [];
        tempIncidents.forEach((incident) => {
            dataPoints.push(incident.location)
        })
        heatmap.setData(dataPoints);
        heatmap.multiply((incidents.length/tempIncidents.length)/1.5);
        map1.addLayer(heatmap)
    }

    let filters = {
        incidentType: function( item )
        {
            if( incidentType == 'all' )  { return true; }
            if( incidentType == 'cars' ) { return !isVRU(item.atts); }
            if( incidentType == 'vru' ) { return isVRU(item.atts); }
        },
        councilDistricts: function( item )
        {
            var include = true;
            if( councilDistrict != 'all' )
            {
                var feature = councilFeatures.features.filter((feature) => {
                    return feature.properties.NAME == councilDistrict
                });
                var pt = turf.point([item.location[1], item.location[0]]);
                include = turf.booleanPointInPolygon(pt, feature[0])
            }
            return include            
        }
    }

    function updateYear() {
        if( incidentsGroup.hasOwnProperty(year) )
        {
            incidents = incidentsGroup[year];
            updateMap();
        }
        else
        {
            get( `${domain}/gdot/${year}-summary.json`, function(incidentJSON) 
            {
                incidentKeys = incidentJSON.keys;
                incidents = incidentJSON.data.map(item => {
                    return {
                        location: [ item.location.lat, item.location.lon ],
                        time: item.time,
                        atts: item.atts
                    }
                });
                incidentsGroup[year] = incidents;
                updateMap();
            });
        }
        
    };
    function lazyLoadJS(src, callback) {
        var script = document.createElement("script");
        script.async = false,
        script.onload = script.onreadystatechange = function(e){
        if(e && e.type == "load" || /loaded|complete/.match(script.readyState)){
            script.onload = script.onreadystatechange = null;
            callback();
        }
    }
        script.src = src,
        document.head.appendChild(script)
    }
    function init() {
        var accessToken = 'pk.eyJ1IjoiYWR0cml2ZXR0ZSIsImEiOiJja3hqcm10bmUwc3hzMnZwZXRiajNydHk3In0.70J9PWirbAZ71d6vwcRXvg';
        var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + accessToken, {
            attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            tileSize: 512,
            zoomOffset: -1
        });

        map1 = window.L.map(mapEl, {
            attributionControl: true,
            zoomControl: true,
            gestureHandling: true,
            dragging: true,
            zoomSnap: 0,
            zoomDelta: 0.5,
        })
        .addLayer(mapboxTiles)
        .setView([33.776, -84.42], 12);
        councilGroups = L.layerGroup();
        incidentsGroup = L.layerGroup();
        heatmap = new L.webGLHeatmap({
            size: 200
        });

        get( domain+'/council-districts-simplified.geojson', function(councilGeoJSON) 
        {
            councilFeatures = councilGeoJSON;

            councilDistricts = councilGeoJSON.features.map(function(feature, index) {
                return {
                    id: feature.properties.NAME,
                    name: feature.properties.GEOTYPE + ' ' + feature.properties.NAME
                }
            });
            councilDistricts = councilDistricts.sort((a, b) => {
                return parseInt(a.id) > parseInt(b.id) ? 1: -1;
            })
            
            updateYear();
            // updateMap();
        });
    }
    onMount( async () => {
        if( browser ) {
            window.L = await import('leaflet');
            const { GestureHandling } = await import('leaflet-gesture-handling');
            lazyLoadJS( '//unpkg.com/leaflet-webgl-heatmap@0.2.7/src/webgl-heatmap/webgl-heatmap.js', () => {
                lazyLoadJS('//unpkg.com/leaflet-webgl-heatmap@0.2.7/dist/leaflet-webgl-heatmap.min.js', () => {
                    init();
                })
            })
            
    

            
        }
    });
</script>