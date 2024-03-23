<div class="col-12 col-lg-3 mt-4">
    <!-- <div class="block">
        <div class="content">

            <select class="form-select mb-2" name="incidentCouncil" bind:value={layers.districts.active} on:change={updateMapHandler}>
                <option value={"all"} selected>All Council Districts</option>
                {#each [...Array(12).keys()] as item }
                    <option value={item+1}>District {item+1}</option>
                {/each}
            </select>
            <select class="form-select mb-2" name="incidentPrecinct" bind:value={layers.precincts.active} on:change={updateMapHandler}>
                <option value={"all"} selected>All Police Precincts</option>
                {#each [...Array(7).keys()] as item }
                    <option value={item+1}>Precinct {item+1}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="block">
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" name="laneType" id="protectedLanes" type="checkbox" bind:group={layers.lanes.active} value={"protected"} on:change={updateMapHandler}  />
                <label class="form-check-label" for="protectedLanes">Protected Bike Lanes</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="laneType" id="unprotectedLanes" type="checkbox" bind:group={layers.lanes.active} value={"unprotected"} on:change={updateMapHandler}  />
                <label class="form-check-label" for="unprotectedLanes">Unprotected Bike Lanes</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="laneType" id="currentPaths" type="checkbox" bind:group={layers.lanes.active} value={"paths"} on:change={updateMapHandler} />
                <label class="form-check-label" for="currentPaths">Multi-use Paths</label>
            </div>
            {#if layers.lanes.active.includes('future') }
                <div class="form-check mb-2">
                    <input class="form-check-input" name="laneType" id="completeStreets" type="checkbox" bind:group={layers.lanes.active} value={"complete"} on:change={updateMapHandler} />
                    <label class="form-check-label" for="completeStreets">Complete Streets</label>
                </div>
            {/if}
        </div>
    </div> -->
</div>
<div class="col-12 col-lg-9 my-4">
    <div class="block">
        <div id="map"></div>
    </div>
    
</div>
<style>
    #map {
        height: 550px;
        background-color: transparent;
        backdrop-filter: blur(5px);
    }
</style>

<script>
    // export let id;

    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';

    import 'leaflet/dist/leaflet.css';
    import { browser } from "$app/environment";
    let domain = 'https://civics.city/atlanta/data';
    domain = 'https://s3.amazonaws.com/civics.city/atlanta/data';
    onMount( async () => {
        if( browser ) {
            const L = await import('leaflet');
            var map = L.map('map', {
                attributionControl: false,
                zoomControl: true,
                scrollWheelZoom: true,
                dragging: false
            }).setView([33.776, -84.42], 11);
            var mapLayers = {};

            // Show GA Highways
            get( domain+'/highways.geojson', function(roadGeoJSON) 
            {
                // console.log(roadGeoJSON)
                mapLayers['highways'] = L.geoJSON( roadGeoJSON, {
                    style: function() {
                        return { color: 'rgba(255,255,255,0.025)' }
                    }
                }).addTo(map);
            });

            get( domain+'/neighborhood-demographics.geojson', function(councilGeoJSON) 
            {
                mapLayers['districts'] = L.geoJSON(councilGeoJSON, {
                    style: function (feature) {
                        return {color: 'rgb(180,0,180)', fillOpacity: 0.6};
                    },
                    onEachFeature: function(feature, layer) {
                    var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                        let names = {
                            'STATISTICA': 'Statistical Area',
                            'pop': 'Population',
                            'NEIGHBORHO': 'Neighborhoods',
                            'white': '% White',
                            'black': '% Black',
                            'asian': '% Asian',
                            'other': '% Other',
                            'hispanic': '% Hispanic',
                            'NPU': 'NPU'
                        }
                        let key = currValue[0];
                        let value = currValue[1];
                        return (!['OBJECTID', 'GlobalID', 'last_edited_date', 'A', 'URL', 'POP2010'].includes(currValue[0])) ? `${prevValue}<tr><th>${names[key]}</th><td>${value}</td></tr>` : prevValue;
                    }, '');
                    layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})
                }
                }).addTo(map);

                // map.fitBounds( mapLayers['districts'].getBounds() );

            });
        }
    });
</script>
 