<div id="map" class="map-tall"></div>
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
    import { browser } from "$app/environment";
    let domain = 'https://civics.city/atlanta/data';

    onMount( async () => {
        if( browser ) {
            const L = await import('leaflet');
            var map = L.map('map', {
                attributionControl: false,
                zoomControl: false,
                scrollWheelZoom: false,
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

            get( domain+'/council-districts-simplified.geojson', function(councilGeoJSON) 
            {
                mapLayers['districts'] = L.geoJSON(councilGeoJSON, {
                    style: function (feature) {
                        return {color: 'rgb(180,0,180)', fillOpacity: 0.6};
                    },
                    filter: function(feature) {
                        return ( parseInt( feature.properties.NAME) == id )
                    }
                }).addTo(map);

                map.fitBounds( mapLayers['districts'].getBounds() );

            });
        }
    });
</script>
 