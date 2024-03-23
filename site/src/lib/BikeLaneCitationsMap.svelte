<div class="col-12 mt-4 text-center">
    <h2>2017-2022 Bike Lane Citations</h2>
</div>
<div class="col-12 col-lg-3 mt-4">
    <div class="block">
        <div class="content">
            <div class="input-group mb-2">
                <label class="input-group-text" for="incidentDateStart">Start</label>
                <input class="form-control" id="incidentDateStart" name="incidentDateStart" type="date" bind:value={minDate} min="2017-01-05" on:change={updateMapHandler} />
                
            </div>
            <div class="input-group mb-2">
                <label class="input-group-text" for="incidentDateEnd">End</label>
                <input class="form-control" id="incidentDateEnd" name="incidentDateEnd" type="date" bind:value={maxDate} max="2022-12-31"  on:change={updateMapHandler} />
                
            </div>
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
    </div>
    
    <div class="block">
        <div class="title"># of Citations</div>
        <div class="content text-center"><h2>{incidentCount.toLocaleString('en-US')}</h2></div>
    </div>
    <p class="text-center mt-2">
        <a data-sveltekit-reload class="btn btn-primary" href="/bike-lane-citations/">Data Dashboard</a>
    </p>
</div>
<div class="col-12 col-lg-9 my-4">
    <ul class="nav" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <a class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" href="#" role="tab" aria-controls="home" aria-selected="true">Map</a>
        </li>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="profile-tab"  data-bs-toggle="tab" data-bs-target="#list" href="#" role="tab" aria-controls="profile" aria-selected="false">Data</a>
        </li>
    </ul>
    <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <div bind:this={mapEl} class="map"></div>
        </div>
        <div class="tab-pane fade" id="list" role="tabpanel" aria-labelledby="profile-tab">
            <table>
                <tr>
                    <th>Citation</th>
                    <th>Date, Time</th>
                    <th>Location</th>
                </tr>
                {#each layers.incidents.tempDataset.features as item }
                    <tr>
                        <td>{item.properties["Violation Description"]}</td>
                        <td>{new Date(item.properties['Issue Date']).toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short'})}</td>
                        <td>{item.properties['Location Address']}</td>
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</div>
<div class="col-12">
    <p class="text-end"><small>Source: Open Records Request by <a href="https://instagram.com/atlantabikegrid/" target="_blank" rel="noreferrer">@atlantabikegrid</a></small></p>
    <hr /> 
</div>
<div class="col-12">
    <h3>Details & Caveats</h3>
    <ul>
        <li> Data was geocoded based on data provided by APD. It appears that there are a number of tickets in areas without bike lanes. This could be for a number of reasons. APD may have provided incorrect locations, or provided incorrectly coded citation data, or people are being ticketed incorrectly.</li>
        <li>Location coordinates have been slightly randomized(within ~100ft) because many citations have the exact same locations.</li>
        <li>Not all citations even included location data. See Data tab.</li>
    </ul>

</div>
<style>
    .map,
    #list {
        height: 1000px;
    }
    #list {
        overflow-y: scroll;
        padding: .5rem;
    }
    .bg-cars {
        background-color: rgba(54, 162, 235, 1);
    }
    .bg-vru {
        background-color: rgba(255, 99, 132, 1);
    }
</style>

<script>
    import { onMount } from 'svelte';
    import * as turf from '@turf/turf';
    import 'leaflet/dist/leaflet.css';
    import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
    import { browser } from "$app/environment";
    import MapHelper from "$lib/_mapHelpers"
    let minDate = "2017-01-01";
    let maxDate = '2022-12-31';

    let days = (new Date(maxDate) - new Date(minDate))/(1000*60*60*24);
    console.log({days})
    let incidentCount = 0;
    let domain = 'https://civics.city/atlanta/data';
    domain = 'https://s3.amazonaws.com/civics.city/atlanta/data'
    let mapEl = null;
    let map = null;
    let incidentFreeDays = 0;

    

    let layers = {
        districts: {
            source: domain+'/council-districts-simplified.geojson',
            dataset: null,
            bounds: true,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(0,255,255,.5)', fillOpacity: 0.1};
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
        precincts: {
            source: domain+'/police-precincts-simplified.geojson',
            dataset: null,
            bounds: true,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(255,255,0,.5)', fillOpacity: 0.1};
                }
            },
            active: 'all',
            filters: [
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        return ( layers.precincts.active == 'all' ) ? false : item.properties.ZONE == layers.precincts.active
                    });
                    return dataset;
                }
            ]
        },
        cityLimits: {
            source: domain+'/atl-city-limits.geojson',
            dataset: null,
            bounds: true,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(255,0,255,.5)', fillOpacity: 0.1};
                }
            },
            filters: [
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        return ( layers.districts.active == 'all' && layers.precincts.active == 'all' ) ? true : false
                    });
                    return dataset;
                }
            ]
        },
        incidents: {
            source: domain+'/bike-lane-citations.geojson',
            dataset: null,
            bounds: false,
            tempDataset: {
                features: []
            },
            layerGroup: null,
            featureOpts: {
                pointToLayer: function(feature, latlng) {
                    console.log(latlng)
                    latlng.lat += Math.random()*0.0005;
                    latlng.lng += Math.random()*0.0005;
                    return L.circleMarker(latlng, {
                        color: 'transparent',
                        fillColor: 'rgba(54, 252, 235, .9)',
                        fillOpacity: 1,
                        radius: 4
                    })
                },
                onEachFeature: function(feature, layer) {
                    var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                        return (['id', 'ref'].indexOf(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                    }, '');
                    layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})
                }
            },
            active: 'all',
            filters: [
                (dataset) => {
                    if( layers.districts.active != 'all' && layers.districts.dataset != null ) {
                        dataset.features = dataset.features.filter(item => {
                            var feature = layers.districts.dataset.features.filter((feature) => {
                                return feature.properties.NAME == layers.districts.active
                            });
                            var pt = turf.point(item.geometry.coordinates);
                            return turf.booleanPointInPolygon(pt, feature[0])
                        })
                    }

                    return dataset;
                },
                (dataset) => {
                    if( layers.precincts.active != 'all' && layers.precincts.dataset != null ) {
                        dataset.features = dataset.features.filter(item => {
                            var feature = layers.precincts.dataset.features.filter((feature) => {
                                return feature.properties.ZONE == layers.precincts.active
                            });
                            var pt = turf.point(item.geometry.coordinates);
                            return turf.booleanPointInPolygon(pt, feature[0])
                        })
                    }

                    return dataset;
                },
                (dataset) => {
                    let dayList = []
                    let maxDay = new Date(minDate).getTime();
                    dataset.features = dataset.features.filter(item => {
                        var properties = item.properties;
                        var d = new Date(properties['Issue Date']);
                        var startDate = new Date(minDate);
                        var endDate = new Date(maxDate);
                        if( dayList.indexOf(d.toDateString()) == -1
                        && d >= startDate && d <= endDate ) {
                            dayList.push(d.toDateString())
                        }
                        maxDay = Math.max(maxDay, d.getTime());

                        return ( d >= startDate && d < endDate ) ? true : false;
                    })
                    // Get number of days in range
                    days = Math.round((new Date(maxDate) - new Date(minDate))/(1000*60*60*24));
                    // console.log('days', days);
                    // console.log('dayList length', dayList)
                    incidentCount = dataset.features.length;
                    incidentFreeDays = days - (dayList.length);
                    
                    return dataset;
                },
            ]
        },
        lanes: {
            source: domain+'/atldot-bike-lanes.geojson',
            dataset: null,
            layerGroup: null,
            tempDataset: {
                features: []
            },
            featureOpts: {
                style: function (feature) {
                    var protection = feature.properties.PROTECTION;
                    var onroad = feature.properties.ON_OFFROAD;
                    var protected1 = ( protection == 'High' 
                            && onroad == 'On' )
                    return {color: protected1 ? 'rgba(255, 99, 132, .4)':'rgba(54, 162, 235, .4)', fillOpacity: 0.1};
                },
                onEachFeature: function(feature, layer) {
                    var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                        return (['id', 'ref'].indexOf(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                    }, '');
                    layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})
                }
            },
            active: ['protected', 'unprotected', 'current'],
            filters: [
                ( dataset ) => {
                    // Removing duplicates
                    dataset.features = dataset.features.filter( item => {
                        var id = item.properties.OBJECTID;
                        return (![190, 164, 187, 188].includes(id))
                    })
                    return dataset;
                },
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        var status = item.properties.STATUS;
                        var type = item.properties.FACILITY_TYPE;
                        var include = false;
                        // console.log(layers.lanes.active);
                        if( status == 'Existing' ) {
                            include = true;
                        }

                        if( type == 'Shared Lane Markings' 
                            || type == 'Sharrows') {
                            include = false
                        }
                        return include;
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
                },
                (dataset) => {
                    if( layers.districts.active != 'all' && layers.districts.dataset != null ) {
                        dataset.features = dataset.features.filter(item => {
                            // console.log(item);
                            var feature = layers.districts.dataset.features.find((feature) => {
                                return feature.properties.NAME == layers.districts.active
                            });
                            var line = turf.lineString(item);
                            return turf.booleanIntersects(item, feature)
                        })
                    }
                    
                    return dataset;
                },
                (dataset) => {
                    if( layers.precincts.active != 'all' && layers.precincts.dataset != null ) {
                        dataset.features = dataset.features.filter(item => {
                            // console.log(item);
                            var feature = layers.precincts.dataset.features.find((feature) => {
                                return feature.properties.ZONE == layers.precincts.active
                            });
                            var line = turf.lineString(item);
                            return turf.booleanIntersects(item, feature)
                        })
                    }
                    
                    return dataset;
                },
            ]
        },
    };
    let mapHelper = new MapHelper()
    function updateMapHandler() {
        
        layers = mapHelper.updateMap(layers);
    }

    onMount( async () => {
        if( browser ) {
            var response =  mapHelper.initMapLayers( layers, mapEl, map );
            response.then(data => {
                layers = data;

            })
        }
    });
</script>
 