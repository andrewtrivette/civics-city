<div class="col-12 col-lg-3 mt-4">
    <div class="block">
        <div class="title">Status</div>
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" name="projectType" id="current" type="checkbox" bind:group={layers.lanes.active} value={"current"} on:change={updateMapHandler}  />
                <label class="form-check-label existing" for="current">Include Current</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="projectType" id="funded" type="checkbox" bind:group={layers.lanes.active} value={"funded"} on:change={updateMapHandler}  />
                <label class="form-check-label funded" for="funded">Include Funded</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="projectType" id="planned" type="checkbox" bind:group={layers.lanes.active} value={"planned"} on:change={updateMapHandler}  />
                <label class="form-check-label planned" for="planned">Include Planned</label>
            </div>
        </div>
        <div class="title">Type</div>
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
        </div>
        <div class="title">District</div>
        <div class="content">            
            <select class="form-select" name="incidentCouncil" bind:value={layers.districts.active} on:change={updateMapHandler}>
                <option value={"all"} selected>All Council Districts</option>
                {#each [...Array(12).keys()] as item }
                    <option value={item+1}>District {item+1}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="block">
        <div class="title">Total Miles</div>
        <div class="content">
            <p>{totalCurrentMiles.toFixed(2)} Current Miles</p>
            <p>{totalFutureMiles.toFixed(2)} Future Miles</p>
        </div>
    </div>
    <div><small><a href="https://atldot.atlantaga.gov/resources-2/capital-delivery" target="_blank" rel="noreferrer">Source: ATL DoT</a></small></div>
</div>
<div class="col-12 col-lg-9 my-4">
    <ul class="nav" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <a class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" role="tab" aria-controls="home" aria-selected="true">Map</a>
        </li>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="profile-tab"  data-bs-toggle="tab" data-bs-target="#list" role="tab" aria-controls="profile" aria-selected="false">List</a>
        </li>
    </ul>
    <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <div bind:this={mapEl} class="map"></div>
        </div>
        <div class="tab-pane fade list" id="list" role="tabpanel" aria-labelledby="profile-tab">
            {#if layers.lanes.tempDataset.features.length > 0 }
            <h3>Existing Infrastructure</h3>
            <table>
                <tr>
                    <th>Name</th>
                    <th>length(miles)</th>
                    <th>Protection</th>
                    <th>Year Installed</th>
                </tr>
                {#each layers.lanes.tempDataset.features as item (item.id) }
                    {#if item.properties.LengthMi != null }
                    <tr>
                        <th>{item.properties.Name}</th>
                        <td>{item.properties.LengthMi.toFixed(2)}</td>
                        <td>{item.properties.Protection}</td>
                        <td>{(item.properties.Status == 'Existing') ? item.properties.YearInstalled: ''}</td>
                    </tr>
                    {/if}
                {/each}
            </table>
            {/if}
           
        </div>
    </div>
</div>
<div class="col-12">
    <hr />
</div>
<div class="col-12">
    <table>
        <tr>
            <th>Year</th>
            <th>Length (miles)</th>
        </tr>
        {#each Object.entries(years) as [year, miles]}
            <tr>
                <th>{year}</th>
                <td>{miles.toFixed(2)}</td>
            </tr>
        {/each}
    </table>
</div>

<style>
    .map,
    .list {
        height: 1000px;
    }
    .list {
        padding: 10px;
        overflow-y: scroll;
    }
    .planned {
        border-bottom: 3px solid rgb(255, 99, 132);
    }
    .existing {
        border-bottom: 3px solid rgb(54, 217, 235);
    }
    .funded {
        border-bottom: 3px solid rgb(226, 235, 54);
    }
    th, td {
        padding: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
</style>

<script>
    import { onMount } from 'svelte';

    import 'leaflet/dist/leaflet.css';
    import { browser } from "$app/environment";
    import MapHelper from "$lib/_mapHelpers"
    import * as turf from '@turf/turf';

    let domain = 'https://civics.city/atlanta/data';
    let mapEl = null;
    let map = null;
    let totalCurrentMiles = 0;
    let totalFutureMiles = 0;
    let years = {};
    let laneColors = {
        'Existing': 'rgb(54, 217, 235)',
        'Planned': 'rgb(255, 99, 132)',
        'Funded': 'rgb(226, 235, 54)'
    }

    let layers = {
        districts: {
            source: domain+'/council-districts-simplified.geojson',
            // sourceCallback: (geoJSON) => {

            // },
            dataset: null,
            layerGroup: null,
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(255,0,255,.5)', fillOpacity: 0.1};
                }
            },
            bounds: true,
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
            layerGroup: null,
            bounds: true,
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
        lanes: {
            source: domain+'/bike-facilities.geojson',
            dataset: null,
            layerGroup: null,
            sourceCallback: (geoJSON) => {
                console.log(geoJSON);
                return geoJSON;
            },
            tempDataset: {
                features: []
            },
            featureOpts: {
                style: function (feature) {
                    return {color: laneColors[feature.properties.Status], fillOpacity: 0.2, opacity: feature.properties.Protection == 'High' ? 1 : 0.5};
                },
                onEachFeature: function(feature, layer) {
                    var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                        return (['id', 'ref'].indexOf(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                    }, '');
                    layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})

                    var year = feature.properties.YearInstalled;
                    if( year != null ) {
                        if( !years.hasOwnProperty(year) ) {
                            years[year] = 0;
                        }
                        years[year] += feature.properties.LengthMi;    
                    }
                    
                }
            },
            active: ['protected', 'paths', 'current'],
            filters: [
                ( dataset ) => {
                    totalCurrentMiles = 0;
                    totalFutureMiles = 0;
                    years = {};
                    dataset.features = dataset.features.filter(item => {
                        var status = item.properties.Status;
                        var type = item.properties.FacilityType;
                        var include = false;
                        // console.log(layers.lanes.active);
                        if( status == 'Existing' && layers.lanes.active.includes('current') ) {
                            include = true;
                        }
                        if( status == 'Planned' && layers.lanes.active.includes('planned')) {
                            include = true;
                        }
                        if( status == 'Funded' && layers.lanes.active.includes('funded') ) {
                            include = true;
                        }
                        if( ['UNKNOWN', 'Shared Lane Markings', 'Sharrows', null, 'Undefined', ].includes(type) ) {
                            include = false
                        }
                        return include;
                    })
                    return dataset;
                },
                (dataset) => {
                    
                    dataset.features = dataset.features.filter(item => {
                        var include = false;
                        var protection = item.properties.Protection;
                        var onroad = item.properties.OnRoad;
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
                        if( include == true )
                        {
                            if( item.properties.Status == 'Existing') {
                                totalCurrentMiles += item.properties.LengthMi;
                            }
                            else
                            {
                                totalFutureMiles += item.properties.LengthMi;
                            }
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
 