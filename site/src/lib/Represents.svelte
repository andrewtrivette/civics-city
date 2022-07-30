<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css">
    <!-- <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script> -->

</svelte:head>

{#if showControls != false}
<div class="col-12 col-lg-4 mt-4">
    {#if type == null }
        <div class="block">
            <div class="title">City of Atlanta Regions</div>
            <div class="content">
                <div class="form-check mb-2">
                    <input class="form-check-input" id="regionDistricts" name="region" type="radio" value="districts" checked on:change={selectRegionHandler} />
                    <label class="form-check-label" for="regionDistricts">Council Districts</label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" name="region" id="regionPolice" type="radio" value="police" on:change={selectRegionHandler} />
                    <label class="form-check-label" for="regionPolice">Police Precincts </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" name="region" id="regionNPU" type="radio" value="npu" on:change={selectRegionHandler}  />
                    <label class="form-check-label" for="regionNPU">NPU's</label>
                </div>
            </div>
        </div>
    {/if}
    {#if geolocation }
        <div class="block">
            <div class="content text-center">
                <button class="btn btn-light { findLocationActive || 'disabled' }" type="submit" name="action" id="findLocation" on:click={ clickLocationHandler}>Find My Regions
                    <i class="material-icons right">my_location</i>
                </button> 
                {#if !findLocationActive }
                    <a id="clearLocation" on:click={clearLocation}><span class="px-3">Clear</span></a>
                {/if}
            </div>
        </div>
        {#if repDistrict || repPrecinct || npuRep }
            <div id="rep" class="block">
                <div class="content">
                    <p>
                        <span id="repDistrict">{@html repDistrict}</span>
                        <span id="repNPU">{@html npuRep}</span>
                        <span id="repPrecinct">{@html repPrecinct}</span>
                    </p>
                </div>
            </div>
        {/if}
    {/if}
</div>
{/if}
<div class="col-12 { showControls != false && 'col-lg-8'} mt-4">
    <div class="block">
        <div class="instructions">Select Region For More Info</div>
        <div id="map" class="map-tall" /> 
    </div>
</div>

{#if councilmembers.length > 0 && showCouncil }
    <div class="col-12 text-center" id="repLookupResults">
        <div class="block">
            <div class="title">Your Councilmembers</div>
            <div class="content">
                <div class="row pb-3">
                    {#each councilmembers as member (member.UserID) }
                        <div class="col s12 l3 text-white center-align">
                            <a href="/member/{member.UserID}" class="text-white">
                                <div class="circle">
                                    <img src="https://atlantacityga.iqm2.com/api/UserAccount/{member.UserID}/AvatarThumbnail" alt="{member.FullName} {member.title}">
                                </div>
                                <b>{member.FullName}</b>
                                <br>
                                <span>{member.title}</span>
                            </a>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    #map {
        height: 350px;
        background-color: transparent;
        backdrop-filter: blur(5px);
    }
    #map.map-tall {
        height: 500px;
    }
    .instructions {
        position: absolute;
        z-index: 1;
        background-color: rgba(0,0,0,0.5);
        padding: 5px 10px;
        font-size: 14px;
        right: 0;
    }
    .circle {
        border-radius: 100%;
        overflow: hidden;
        width: 60px;
        height: 60px;
        margin: 10px auto;
    }
    .circle img {
        width: 100%;
        height: auto;
    }
    .circle.large {
        width: 100px;
        height: 100px;
        margin: 20px auto;
    }
    .district {
        background-color: #4D104D;
        margin: -40px 0 40px 0;
        padding: 0.7rem 0 1rem 0;
        line-height: 1;
        transform: rotate(-2deg);
        box-shadow: 1px 1px 3px #333;
        border-radius: 3px;
    }
</style>

<script>
    export let type;
    export let showControls;
    export let showCouncil;
    import { get, setCookie, getCookie, deleteCookie } from "$lib/_helpers";
    import * as turf from '@turf/turf';
    // import * as L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
    import { onMount } from 'svelte';
    import { browser } from "$app/env";

    let currLocation = null;

    var mapLayers = [];
    let findLocationActive = true;
    let npuRep = '';
    let repDistrict = '';
    let repPrecinct = null;
    let domain = 'https://civics.city/atlanta/data';
    let map = null;
    let geolocation = null;
    let councilmembers = [];
    
    onMount(async () => {
        if( browser ) {
            const L = await import('leaflet');
            const { GestureHandling } = await import('leaflet-gesture-handling') 
            console.log('init');
            var cookieLoc = getCookie('location');
            if( cookieLoc ) {
                var loc = cookieLoc.split('|');
                currLocation = loc;
                findLocationActive = false;
            }
            if( map == null )
            {
                map = L.map('map', {
                    attributionControl: false,
                    zoomControl: true,
                    minZoom: 10,
                    gestureHandling: true,
                    dragging: false
                }).setView([33.776, -84.42], 11);
            }
            // Show GA Highway
            get( domain+'/highways-simplified.geojson', function(roadGeoJSON) 
            {
                mapLayers['highways'] = L.geoJSON( roadGeoJSON, {
                    style: function() {
                        return { color: 'rgba(255,255,255,0.025)' }
                    }
                }).addTo(map);
            });
            geolocation = navigator.geolocation;
            if( type == null || type == 'districts' )
            {
                showDistricts();
            }
            else if( type == 'precincts' )
            {
                showPrecincts();
            }
            else if( type == 'npus' )
            {
                showNPUs();
            } 
        }
    });

    function clearLocation(e) {
        e.preventDefault();
        deleteCookie('location');
        findLocationActive = true;
        currLocation = null;
    }

    function findLocation( lat, lng ) 
    {
        // findLocationActive *= -1;

        L.marker([lat, lng]).addTo(map);
        var pt = turf.point([lng, lat]);

        if( type == null || type == 'districts' ) {
            get( domain+'/council-districts-simplified.geojson', function(geoJSON) 
            {
                var district = null;
                var districtName = null;   
                geoJSON.features.forEach(function(feature, index) {
                    if( turf.booleanPointInPolygon(pt, feature) )
                    {
                        district = feature;
                        districtName = district.properties.NAME;
                        repDistrict = '<span>It looks like you live in <a href="/district/'+districtName+'">District '+districtName+'</a></span>';
                    }
                });

                if( district != null )
                {
                    get( domain+'/council-members.json', function(members) 
                    {
                        for( var i=0; i<members.length; i++ )
                        {
                            var member = members[i];
                            member.title = member.Title.replace('Councilmember, ', '');
                            if( member.title == 'District '+districtName ||  member.title.indexOf('At Large') != -1 )
                            {
                                if( member.title.indexOf('District') != -1 )
                                {
                                    councilmembers = [ member, ...councilmembers];
                                }
                                else
                                {
                                    councilmembers.push(member);
                                }
                            }
                        }
                    });
                }
                else
                {
                    repResults = 'It looks like you may not be located in the City of Atlanta right now';
                }
            });
        }

        if( type == null || type == 'npus' ) {
            get( domain+'/npu-simplified.geojson', function(geoJSON) 
            {
                geoJSON.features.forEach(function(feature, index) {
                    if( turf.booleanPointInPolygon(pt, feature) )
                    {
                        npuRep = '<span>, your NPU is <a href="https://www.atlantaga.gov/government/departments/city-planning/office-of-zoning-development/neighborhood-planning-unit-npu" target="_blank">NPU '+feature.properties.NAME+'</a>';
                    }
                });
            });
        }

        if( type == null || type == 'precincts' ) {
            get( domain+'/police-precincts-simplified.geojson', function(geoJSON) 
            {
                geoJSON.features.forEach(function(feature, index) {
                    if( turf.booleanPointInPolygon(pt, feature) )
                    {
                        repPrecinct = '<span>, and your police precinct is <a href="https://www.atlantapd.org/community/apd-zones/zone-'+feature.properties.ZONE+'" target="_blank">Precinct '+feature.properties.ZONE+'</a>';
                    }
                });
            });
        }
        var located = false;
        map.eachLayer(function(layer) {
            if( layer.hasOwnProperty('group') && layer.hasOwnProperty('feature') )
            {
                if( turf.booleanPointInPolygon(pt, layer.feature.geometry) )
                {
                    layer.setStyle({color :'#0277bd'});
                    located = true;
                }
            }
        });
        if( located == false )
        {
            repDistrict = 'It looks like you may be outside the Atlanta city limits.';
        }
    }

    // Show District Map
    function showDistricts()
    {
        get( domain+'/council-districts-simplified.geojson', function(councilGeoJSON) 
        {
            // mapLayers['districtsLabel'] = new L.LayerGroup();
            mapLayers['districts'] = L.geoJSON(councilGeoJSON, {
                style: function (feature) {
                    return {color: 'rgb(100, 0, 100)', fillOpacity: 0.6};
                },
                onEachFeature: function(feature, layer) {
                    layer.group = 'district';
                    var marker = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label',
                            html: 'District '+feature.properties.NAME,
                        })
                    }).addTo(map);
                    marker.group = 'district'
                    // mapLayers['districtsLabel'].addLayer(marker);

                    layer.on('click', function(e) {
                        var id = e.target.feature.properties.NAME;
                        window.location = '/district/'+id;
                    });

                    layer.on('mouseover', function(e) {
                        e.target.setStyle({ color: 'rgb(180,0,180)', oldColor: e.target.options.color });
                    });
                    layer.on('mouseout', function(e) {
                        e.target.setStyle({ color: e.target.options.oldColor });
                    });
                }
            }).addTo(map);
            if( currLocation )
            {
                findLocation(currLocation[0], currLocation[1] );
            }
            map.fitBounds( mapLayers['districts'].getBounds() );
        });
    }
    

    // Show Precincts Map
    function showPrecincts()
    {
        get( domain+'/police-precincts-simplified.geojson', function(policeGeoJSON) 
        {
            mapLayers['police'] = L.geoJSON(policeGeoJSON, {
                style: function (feature) {
                    return {color: 'rgb(100,0,100)', fillOpacity: 0.6};
                },
                onEachFeature: function(feature, layer) {
                    layer.group = 'police';
                    var marker = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label',
                            html: 'Precinct '+feature.properties.ZONE,
                        })
                    }).addTo(map);

                    marker.group = 'police';

                    layer.on('click', function(e) {
                        var id = e.target.feature.properties.ZONE;
                        window.open('https://www.atlantapd.org/community/apd-zones/zone-'+id, '_blank').focus();
                    });

                    layer.on('mouseover', function(e) {
                        e.target.setStyle({ color: 'rgb(180,0,180)', oldColor: e.target.options.color });
                    });
                    layer.on('mouseout', function(e) {
                        e.target.setStyle({ color: e.target.options.oldColor });
                    });
                }
            }).addTo(map);
            findLocation(currLocation[0], currLocation[1] );
            map.fitBounds( mapLayers['police'].getBounds() );
        });
    }

    // Show NPU Maps
    function showNPUs()
    {
        get( domain+'/npu-simplified.geojson', function(policeGeoJSON) 
        {
            mapLayers['npu'] = L.geoJSON(policeGeoJSON, {
                style: function (feature) {
                    return {color: 'rgb(100,0,100)', fillOpacity: 0.6};
                },
                onEachFeature: function(feature, layer) {
                    // console.log(feature);
                    layer.group = 'npu';
                    var marker = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label',
                            html: 'NPU '+feature.properties.NAME,
                        })
                    }).addTo(map);

                    marker.group = 'npu';
                
                    layer.on('click', function(e) {
                        window.open('https://www.atlantaga.gov/government/departments/city-planning/office-of-zoning-development/neighborhood-planning-unit-npu', '_blank').focus();
                    });
                    layer.on('mouseover', function(e) {
                        e.target.setStyle({ color: 'rgb(180,0,180)', oldColor: e.target.options.color });
                    });
                    layer.on('mouseout', function(e) {
                        e.target.setStyle({ color: e.target.options.oldColor });
                    });
                }
            }).addTo(map);
            findLocation(currLocation[0], currLocation[1] );
            map.fitBounds( mapLayers['npu'].getBounds() );
        });
    }
    

    function selectRegionHandler(e) {
        if( map )
        {
            map.eachLayer(function(layer) {
                if( layer.hasOwnProperty('group') )
                {
                    map.removeLayer(layer);
                }
            })

            var val = e.target.value;
            var maps = {
                police: showPrecincts,
                districts: showDistricts,
                npu: showNPUs
            };
            if( maps.hasOwnProperty(val) )
            {
                maps[val]();
                // findLocation(currLocation[0], currLocation[1] );
            }
        }
    }


    function clickLocationHandler(e) {
        e.preventDefault();
        findLocationActive = false;

        navigator.geolocation.getCurrentPosition(function(e) {
            var lat = e.coords.latitude;
            var lng = e.coords.longitude;
            setCookie('location', lat+'|'+lng, 7);
            currLocation = [ lat, lng ];
            findLocation(lat, lng);
        }, function() {
            console.log("Unable to retrieve your location");
            repDistrict = 'Unable to retrieve your location';
        })
        
    }

</script>