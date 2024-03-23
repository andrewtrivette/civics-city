<div id="map" class="map-tall"></div>
<div>Additional Historical Context: https://storymaps.arcgis.com/stories/c25357151d31453ca3e4180674c550c4</div>
<style>
    #map {
        height: 750px;
        background-color: black;
        backdrop-filter: blur(5px);
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
                gestureHandling: true,
                dragging: false,
                zoomSnap: 0,
                zoomDelta: 0.5
            });
            var mapLayers = {};

            get( domain+'/atl-city-limits.geojson', function(cityGeoJSON) 
            {
                // console.log(roadGeoJSON)
                mapLayers['cityLimits'] = L.geoJSON( cityGeoJSON, {
                    style: function() {
                        return { color: 'rgba(255,0,255,0.25)' }
                    }
                }).addTo(map);
                map.fitBounds( mapLayers['cityLimits'].getBounds(), { padding: [ 30, 30]} );
            });
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
                        var grade = {
                            A: 'rgb(0,255,0)',
                            B: 'rgb(0,0,200)',
                            C: 'rgb(255,125, 125)',
                            D: 'rgb(255,0, 0)'
                        }
                        return {
                            stroke: false, 
                            fillColor: grade[feature.properties.HOLC_grade], fillOpacity: 1
                        };
                    },
                    // filter: function(feature) {
                    //     return ( feature.properties.HOLC_grade == 'D' )
                    // }
                }).addTo(map);
            });
            get( domain+'/cdia.geojson', function(councilGeoJSON) 
            {
                mapLayers['districts'] = L.geoJSON(councilGeoJSON, {
                    style: function (feature) {
                        return {stroke: false, fillColor: 'rgb(255,0,255)', fillOpacity: 0.5};
                    },
                    onEachFeature: function(feature, layer) {
                        var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                            return (['id', 'ref'].indexOf(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                        }, '');
                        layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})
                    }
                }).addTo(map);
            });
        }
    });
</script>
 