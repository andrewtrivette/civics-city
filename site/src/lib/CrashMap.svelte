<div class="col-12 mt-4 text-center">
    <h2>911 Crash Reports</h2>
    <p>Archive: June 28, 2022 - July 11, 2023</p>
</div>
<div class="col-12 col-lg-3 mt-4">
    <div class="block">
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" id="incidentAll" name="incidentType" type="radio" bind:group={layers.incidents.active} value={"all"} checked on:change={updateMapHandler} />
                <label class="form-check-label" for="incidentAll">All Incidents</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input bg-vru" name="incidentType" id="incidentVRU" type="radio" bind:group={layers.incidents.active} value={"vru"} on:change={updateMapHandler} />
                <label class="form-check-label" for="incidentVRU">Pedestrians & Cyclists</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input bg-cars" name="incidentType" id="incidentCars" type="radio" bind:group={layers.incidents.active} value={"cars"} on:change={updateMapHandler}  />
                <label class="form-check-label" for="incidentCars">Cars</label>
            </div>
            <div class="input-group mb-2">
                <label class="input-group-text" for="incidentDateStart">Start</label>
                <input class="form-control" id="incidentDateStart" name="incidentDateStart" type="date" bind:value={minDate} min="2022-06-28" on:change={updateMapHandler} />
                
            </div>
            <div class="input-group mb-2">
                <label class="input-group-text" for="incidentDateEnd">End</label>
                <input class="form-control" id="incidentDateEnd" name="incidentDateEnd" type="date" bind:value={maxDate} max={'2023-07-11'}  on:change={updateMapHandler} />
                
            </div>
            <select class="form-select" name="incidentCouncil" bind:value={layers.districts.active} on:change={updateMapHandler}>
                <option value={"all"} selected>All Council Districts</option>
                {#each [...Array(12).keys()] as item }
                    <option value={item+1}>District {item+1}</option>
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
        <div class="content text-center"><h2>{(incidentCount/days).toFixed(2).toLocaleString('en-US')}</h2></div>
    </div>

    <div class="block">
        <div class="title text-center"># of Days without a Crash</div>
        <div class="content text-center"><h2>{crashFreeDays} of {days}</h2></div>
    </div>
    
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
                {#each layers.incidents.tempDataset.features as item (item.properties.key) }
                    <tr>
                        <td><a href="https://citizen.com/{item.properties.key}" target="_blank" rel="noreferrer">{item.properties.title}</a></td>
                        <td>{new Date(item.properties.time).toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short'})}</td>
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</div>
<div class="col-12">
    <p class="text-end"><small>Updated Daily</small> | <small>Source: 911 reports via <a href="https://citizen.com" target="_blank" rel="noreferrer">Citizen.com</a></small></p>
    <hr /> 
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

    let minDate = "2022-06-28";
    let maxDate = '2023-07-11';
    let days = (new Date(maxDate) - new Date(minDate))/(1000*60*60*24);
    console.log({days})
    let incidentCount = 0;
    let domain = 'https://civics.city/atlanta/data';
    domain = 'https://s3.amazonaws.com/civics.city/atlanta/data'
    let mapEl = null;
    let map = null;
    let daysSinceVRUCrash = 0;
    let crashFreeDays = 0;
    

    let layers = {
        districts: {
            source: domain+'/council-districts-simplified.geojson',
            dataset: null,
            bounds: true,
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
                        return ( layers.districts.active == 'all' ) ? true : false
                    });
                    return dataset;
                }
            ]
        },
        incidents: {
            source: domain+'/citizen/summary-2022.json',
            dataset: null,
            bounds: false,
            tempDataset: {
                features: []
            },
            layerGroup: null,
            sourceCallback: (geoJSON) => {
                let data = geoJSON['Traffic Related'];
                function isVRU(title) {
                    title = title.toLowerCase();
                    return (
                            title.includes('pedestrian') ||
                            title.includes('bicyclist') ||
                            title.includes('struck by vehicle') ||
                            title.includes('bicycle') ||
                            title.includes('scooter') 
                        );
                        
                }
                let newGeoJSON = {
                    type: "FeatureColection",
                    features: data.map((item, index) => {
                        return {
                            type: "Feature",
                            id: index,
                            geometry: {
                                type: "Point",
                                coordinates: item.location.reverse()
                            },
                            properties: {
                                isVRU: isVRU(item.title),
                                title: item.title,
                                severity: item.severity,
                                time: item.time,
                                key: item.key
                            }
                        }
                    })
                };
                // console.log({newGeoJSON})
                return newGeoJSON;
            },
            featureOpts: {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        color: 'transparent',
                        fillColor: !feature.properties.isVRU ? 'rgba(54, 162, 235, .9)' : 'rgba(255, 99, 132, .9)',
                        fillOpacity: 1,
                        radius: 4
                    })
                },
                onEachFeature: function(feature, layer) {
                    var properties = feature.properties
                    var d = new Date(properties.time).toLocaleString('en-us');
                    layer.bindPopup(`<div><b>${properties.title}</b><br>${d}<br/><a href="https://citizen.com/${properties.key}" target="_blank" rel="noreferrer">Additional Details</a></div>`);
                }
            },
            active: 'all',
            filters: [
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        var properties = item.properties;
                        var type = layers.incidents.active;
                        if( type == 'all' )  { return true; }
                        if( type == 'cars' ) { return !properties.isVRU; }
                        if( type == 'vru' ) { return properties.isVRU; }
                    })
                    
                    return dataset;
                },
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
                    dataset.features = dataset.features.filter(item => {
                        var title = item.properties.title.toLowerCase();
                        return ( !title.includes('mistaken') &&
                                !title.includes('robbed') &&
                                !title.includes('unfounded') &&
                                !title.includes('blocking') &&
                                !title.includes('locked') &&
                                !title.includes('elevator') &&
                                !title.includes('mailbox')
                            )
                    })
                    return dataset;
                },
                (dataset) => {
                    let dayList = []
                    let maxDay = new Date(minDate).getTime();
                    dataset.features = dataset.features.filter(item => {
                        var properties = item.properties;
                        var d = new Date(properties.time);
                        var startDate = new Date(minDate);
                        var endDate = new Date(maxDate);
                        var date = d.getDate();
                        if( dayList.indexOf(d.toDateString()) == -1 ) {
                            dayList.push(d.toDateString())
                        }
                        maxDay = Math.max(maxDay, d.getTime());
                        return ( d >= startDate && d < endDate ) ? true : false;
                    })
                    // Get number of days in range
                    days = Math.round((new Date(maxDate) - new Date(minDate))/(1000*60*60*24));
                    // Get days
                    daysSinceVRUCrash = Math.round(( new Date(maxDate) - new Date(maxDay))/(1000*60*60*24));

                    incidentCount = dataset.features.length;
                    crashFreeDays = days - (dayList.length);
                    return dataset;
                }
            ]
        }
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
 