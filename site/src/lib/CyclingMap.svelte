<div class="col-12 col-lg-3 mt-4">
    <div class="block">
        <div class="title">Status</div>
        <div class="content">
            <div class="form-check mb-2">
                <input class="form-check-input" name="projectType" id="current" type="checkbox" bind:group={layers.lanes.active} value={"current"} on:change={updateMapHandler}  />
                <label class="form-check-label existing" for="current">Include Current</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" name="projectType" id="future" type="checkbox" bind:group={layers.lanes.active} value={"future"} on:change={updateMapHandler}  />
                <label class="form-check-label planned" for="future">Include Planned</label>
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
            {#if layers.lanes.active.includes('future') }
            <div class="form-check mb-2">
                <input class="form-check-input" name="laneType" id="completeStreets" type="checkbox" bind:group={layers.lanes.active} value={"complete"} on:change={updateMapHandler} />
                <label class="form-check-label" for="completeStreets">Complete Streets</label>
            </div>
            {/if}
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
                    {#if item.properties.LENGTH_MILES != null }
                    <tr>
                        <th>{item.properties.NAME}</th>
                        <td>{item.properties.LENGTH_MILES.toFixed(2)}</td>
                        <td>{item.properties.PROTECTION}</td>
                        <td>{(item.properties.STATUS == 'Existing') ? item.properties.YEAR_INSTALLED: ''}</td>
                    </tr>
                    {/if}
                {/each}
            </table>
            {/if}
            {#if layers.projects.tempDataset.features.length > 0 }
            <h3>Projects</h3>
            <table>
                <tr>
                    <th>Name</th>
                    <th>length(miles)</th>
                    <th>Construction Start</th>
                    <th>Construction End</th>
                </tr>
                {#each layers.projects.tempDataset.features as item (item.id) }
                    <tr>
                        <th>{item.properties.FUNDING_PROJECT_NAME}</th>
                        <td>{item.properties.LENGTH_MI.toFixed(2)}</td>
                        <td>{new Date(item.properties.CONSTRUCTION_START_DATE).toDateString()}</td>
                        <td>{new Date(item.properties.CONSTRUCTION_COMPLETION_DATE).toDateString()}</td>
                    </tr>
                {/each}
            </table>
            {/if}
        </div>
    </div>
</div>
<div class="col-12">
    <hr />
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
    .existing {
        border-bottom: 3px solid rgba(255, 99, 132, 1);
    }
    .planned {
        border-bottom: 3px solid rgba(54, 162, 235, 1);
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
            source: domain+'/atldot-bike-lanes.geojson',
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
                    return {color: (feature.properties.STATUS == 'Existing') ? 'rgba(255, 99, 132, .8)':'rgba(54, 162, 235, .8)', fillOpacity: 0.2};
                },
                onEachFeature: function(feature, layer) {
                    var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                        return (['id', 'ref'].indexOf(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                    }, '');
                    layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})
                }
            },
            active: ['protected', 'paths', 'current'],
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
                    totalCurrentMiles = 0;
                    totalFutureMiles = 0;
                    dataset.features = dataset.features.filter(item => {
                        var status = item.properties.STATUS;
                        var type = item.properties.FACILITY_TYPE;
                        var include = false;
                        // console.log(layers.lanes.active);
                        if( status == 'Existing' && layers.lanes.active.includes('current') ) {
                            include = true;
                        }
                        if( ( ['Funded', 'Planned'].includes(status)) && layers.lanes.active.includes('future')) {
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
                        if( include == true )
                        {
                            if( item.properties.STATUS == 'Existing') {
                                totalCurrentMiles += item.properties.LENGTH_MILES;
                            }
                            else
                            {
                                totalFutureMiles += item.properties.LENGTH_MILES;
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
        },
        projects: {
            source: domain+'/atldot-projects.geojson',
            dataset: null,
            layerGroup: null,
            sourceCallback: (geoJSON) => {
                console.log('projects', geoJSON);
                return geoJSON;
            },
            tempDataset: {
                features: []
            },
            featureOpts: {
                style: function (feature) {
                    return {color: 'rgba(54, 162, 235, .8)', fillOpacity: 0.2};
                },
                onEachFeature: function(feature, layer) {
                    var properties = Object.entries(feature.properties).reduce(( prevValue, currValue ) => {
                        return (!['id', 'ref', 'NEIGHBORHOOD', 'COUNCIL_DISTRICT'].includes(currValue[0])) ? prevValue+'<tr><td>'+currValue.join('</td><td>')+'</tr>' : prevValue;
                    }, '');
                    layer.bindPopup('<table>'+properties+'</table>', {maxWidth: 600})
                }
            },
            active: [],
            filters: [
                // ( dataset ) => {
                //     dataset.features = dataset.features.filter( item => {
                //         return (!item.properties.FUNDING_PROJECT_NAME.includes('Right of Way acqusition and Install Lighting'))
                //     })
                //     return dataset;
                // },
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        var category = item.properties.PROJECT_STATUS;
                        var include = false;
                        let projectType = layers.lanes.active;

                        if( projectType.includes('future') 
                            && category.includes('Active') && !category.includes('don\'t map')) { 
                            include = true;
                        }

                        
                        return include;
                    })
                    return dataset;
                },
                ( dataset ) => {
                    dataset.features = dataset.features.filter(item => {
                        var category = item.properties.PROJECT_CATEGORY;
                        var include = false;
                        let projectType = layers.lanes.active;
                        // if( (projectType.includes('protected') || projectType.includes('unprotected') )
                        //     && category.includes('Complete')) { 
                        //     include = true;
                        // }
                        if( projectType.includes('paths') 
                            && category.includes('Trails')) { 
                            include = true;
                        }
                        if( projectType.includes('complete') 
                            && category.includes('Complete')) { 
                            include = true;
                        }
                        if( projectType.includes('protected') && (item.properties.FUNDING_PROJECT_NAME.includes('Cycle') || item.properties.FUNDING_PROJECT_NAME.includes('Mobility') ) ) {
                            include = true;
                        }
                        if( include == true )
                        {
                            totalFutureMiles += item.properties.LENGTH_MI;
                            console.log( item.properties.FUNDING_PROJECT_NAME, item.properties.LENGTH_MI)
                        }
                        
                        return include;
                    })
                    return dataset;
                },
                (dataset) => {
                    if( layers.districts.active != 'all' && layers.districts.dataset != null ) {
                        dataset.features = dataset.features.filter(item => {
                            var feature = layers.districts.dataset.features.find((feature) => {
                                return feature.properties.NAME == layers.districts.active
                            });
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
 