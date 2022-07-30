<div id="map" class="map-tall"></div>
<div>Additional Historical Context: https://storymaps.arcgis.com/stories/c25357151d31453ca3e4180674c550c4</div>
<style>
    #map {
        height: 350px;
        background-color: transparent;
        backdrop-filter: blur(5px);
    }
    #map.map-tall {
        height: 500px;
    }
</style>

<script>
    export let id;

    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';

    import 'leaflet/dist/leaflet.css';
    import { browser } from "$app/env";
    let domain = 'https://civics.city/atlanta/data';

    onMount( async () => {
        if( browser ) {
            const L = await import('leaflet');
            var map = L.map('map', {
                attributionControl: false,
                gestureHandling: true,
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

            get( domain+'/redlining.geojson', function(councilGeoJSON) 
            {
                mapLayers['districts'] = L.geoJSON(councilGeoJSON, {
                    style: function (feature) {
                        return {stroke: false, fillColor: 'rgb(255,255,255)', fillOpacity: .5};
                    },
                    filter: function(feature) {
                        return ( feature.properties.HOLC_grade == 'D' )
                    }
                }).addTo(map);

                map.fitBounds( mapLayers['districts'].getBounds() );

            });
            get( domain+'/cdia.geojson', function(councilGeoJSON) 
            {
                mapLayers['districts'] = L.geoJSON(councilGeoJSON, {
                    style: function (feature) {
                        return {stroke: false, fillColor: 'rgb(255,0,255)', fillOpacity: 0.5};
                    }
                }).addTo(map);

                map.fitBounds( mapLayers['districts'].getBounds() );

            });
        }
    });
</script>
 