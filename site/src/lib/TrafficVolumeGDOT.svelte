<div class="col-12 mt-4 text-center">
    <h2>GDOT Traffic Volume Heatmap</h2>
</div>
<div class="col-12 col-lg-8 my-4">
    <div id="map2" class="map-tall"></div>
</div>

<style>
    #map {
        height: 350px;
    }
    #map.map-tall {
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
    import { get, getCSV } from "$lib/_helpers";
    import { onMount } from 'svelte';

    import 'leaflet/dist/leaflet.css';
    import { browser } from "$app/environment";
    import * as turf from '@turf/turf';

    let domain = 'https://civics.city/atlanta/data';
    let incidents = {};
    let incidentsGroup = null;
    let councilGroups = null;
    let councilFeatures = null;
    let map = null;

    let heatmap = null;

    let updateMap = function() {
        heatmap.remove();
        councilGroups.eachLayer((layer) => {
            layer.remove();
        });
        let tempCouncilGeoJSON = councilFeatures;

        let districts = L.geoJSON(tempCouncilGeoJSON, {
            style: function (feature) {
                return {color: 'rgba(255,0,255,.5)', fillOpacity: 0.2};
            }
        }).addTo(map);
        councilGroups.addLayer(districts);

        map.fitBounds( districts.getBounds(), { padding: [ 30, 30]} );

       
        // let dataPoints = [];
        // tempIncidents.forEach((incident) => {
        //     dataPoints.push(incident.location)
        // })
        // heatmap.setData(dataPoints);
        // heatmap.multiply((incidents.length/tempIncidents.length)/1.5);
        // map.addLayer(heatmap)
    }

    onMount( async () => {
        if( browser ) {
            var accessToken = 'pk.eyJ1IjoiYWR0cml2ZXR0ZSIsImEiOiJja3hqcm10bmUwc3hzMnZwZXRiajNydHk3In0.70J9PWirbAZ71d6vwcRXvg';
            var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + accessToken, {
                attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                tileSize: 512,
                zoomOffset: -1
            });

            map = L.map('map2', {
                attributionControl: true,
                zoomControl: true,
                gestureHandling: true,
                dragging: true,
                zoomSnap: 0,
                zoomDelta: 0.5,
                minZoom: 11,
                maxZoom: 15
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
            });

            getCSV(domain+'/aadt_and_truckpct.csv', function(list) {
                console.log({list})
            });
            
        }
    });
</script>