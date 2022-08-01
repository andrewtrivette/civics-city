
        <div class="text-center">2009 - 2021 Crime Trends</div>
        <div  class="chart">
            <canvas id="crimeChart"></canvas>
        </div>
    <br/>
    <hr>
        <div class="text-center mb-2">Crime Trend By Month</div>
        <div class="row mb-3">
            <div class="col-12 col-lg-6">
                <select class="form-select" name="type" bind:value={types} on:change={updateYoYHandler}>
                    <option value={"group"} selected>Group By Type</option>
                    <option value={"aggregate"}>Sum</option>
                    {#each Object.keys(datasets) as item }
                        <option value={item}>{item}</option>
                    {/each}
                </select>
            </div>
            <div class="col-12 col-lg-6">
                <select class="form-select" name="isYoY" bind:value={yoY} on:change={updateYoYHandler}> 
                    <option value="yoy" selected>{prevYear} vs {currYear} YTD</option>
                    <option value={currYear.toString()}>{currYear} YTD</option>
                </select>
            </div>
        </div>
            
        <div class="chart mb-4">
            <canvas id="crimeChart2"></canvas>
        </div>
        <div class="kpis row text-center">
            {#each Object.keys(tempDataset) as item }
                <div class="col-6 mb-3">
                    <div class="kpi">
                        <div class="value">{(tempDataset[item].data.reduce((a,b) => { return a+b[1] }, 0)).toLocaleString('en-US')}</div>
                        <div class="label">{tempDataset[item].label+(perCapita == true ? ' Per Capita' : '')}</div>
                    </div>
                    
                </div>
            {/each}
        </div>
        <div class="text-end">
            <small><a href="https://www.atlantapd.org/i-want-to/crime-data-downloads" target="_blank">Source: APD Crime Data</a></small>
        </div>


<script>
    export let type;
    export let region;
    export let perCapita;
    import { get } from "$lib/_helpers";
    import Chart from "chart.js/auto/auto.js";
    import { onMount } from 'svelte';

let domain = 'https://s3.amazonaws.com/civics.city/atlanta/data';
var d = new Date();
var currYear = d.getFullYear();
let prevYear = currYear -1;
var currMonth = (d.getMonth() + 1 ).toString().padStart(2, '0');
let datasets = {};
let types = 'group';
let yoY = 'yoy';
let aggData = {};
let aggDatasets = {};
aggDatasets[currYear] = {};
aggDatasets[prevYear] = {};
let aggChart = null;
let tempDataset = {};
const updateYoYHandler = function() {
    let tempDatasets = {};
    tempDatasets[currYear] = Object.fromEntries( 
        Object.entries( aggDatasets[currYear] ).filter(([key, value]) => {
            if( types == 'group' )
            {
                return [`${currYear}_People`, `${currYear}_Property`].includes(key)
            }
            else if( types == 'aggregate' )
            {
                return `${currYear}_Total` == key
            }
            else {
                return key == currYear+' '+types;
            }
        })
    );
    tempDatasets[prevYear] = Object.fromEntries(
        Object.entries( aggDatasets[prevYear] ).filter(([key, value]) => {
            if( types == 'group' )
            {
                return [`${prevYear}_People`, `${prevYear}_Property`].includes(key)
            }
            else if( types == 'aggregate' )
            {
                return `${prevYear}_Total` == key
            }
            else
            {
                return key == prevYear+' '+types;
            }
        })
    );
    tempDataset = ( yoY == 'yoy' ) ? Object.assign({}, tempDatasets[currYear], tempDatasets[prevYear]) : tempDatasets[yoY];
    console.log({yoY, tempDataset});
    var ctx = document.querySelector('#crimeChart2').getContext('2d');
    if( aggChart != null )
    {
        aggChart.destroy();
    }
    aggChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(aggData).sort(),
            datasets: Object.values( tempDataset )
        },
        options: {
            elements: {
                point: {
                    borderColor: 'rgba(255, 255, 255, 0.7)'
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        text: 'Police Incidents'+(perCapita == true ? ' Per Capita' : ''),
                        display: true
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 40
                    }
                }
            }
        }
    });
}

onMount(() => {
    var population = {
        2022: 532695,
        2021: 524100,
        2020: 515400,
        2019: 506800,
        2018: 498200,
        2017: 491700,
        2016: 479200,
        2015: 468300,
        2014: 461200,
        2013: 454000,
        2012: 449000,
        2011: 437800,
        2010: 429400,
        2009: 428000
    };

    Chart.defaults.color = 'white';
    Chart.defaults.font.size = 16;
    Chart.overrides.line.borderColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(153, 192, 86, 1)',
        'rgba(75, 162, 132, 1)',
        'rgba(255, 102, 64, 1)',
        'rgba(54, 192, 64, 1)',
        'rgba(255,255,255, 1)',
        'rgba(0, 99, 255, 1)',
        'rgba(255, 0, 126, 1)'
    ];

    get( domain+'/COBRA/year-aggregate.json', function(data) 
    {
        if( data[currYear] )
        {
            delete data[currYear]
        }
        var yearKeys = Object.keys(data);
        
        
        yearKeys.forEach((yearKey) => {
            
            var year = data[yearKey];
            var yearField = year['sum']
            if( type != 'all' && region != null ) {
                yearField = year[type][region]
            }
            Object.keys(yearField).forEach((crimeKey) => {
                if( ['ROBBERY-RESIDENCE', 'ROBBERY-PEDESTRIAN', 'ROBBERY-COMMERCIAL'].indexOf(crimeKey) != -1 )
                {
                    if( !yearField.hasOwnProperty('ROBBERY') )
                    {
                        yearField.ROBBERY = 0;
                    }
                    yearField.ROBBERY += yearField[crimeKey];
                    delete yearField[crimeKey];
                }
                if( ['BURGLARY-RESIDENCE', 'BURGLARY-NONRES'].indexOf(crimeKey) != -1 )
                {
                    if( !yearField.hasOwnProperty('BURGLARY') )
                    {
                        yearField.BURGLARY = 0;
                    }
                    yearField.BURGLARY += yearField[crimeKey];
                    delete yearField[crimeKey];
                }
            })
            Object.keys(yearField).forEach((crimeKey) => {
                var crime = yearField[crimeKey];
                if( !datasets.hasOwnProperty(crimeKey) )
                {
                    datasets[crimeKey] = { label: crimeKey, data: [], tension: 0.2 }
                }
                var val = (perCapita == true) ? crime/population[yearKey]*10000 : crime;
                datasets[crimeKey].data.push([yearKey, val])
            })
            
        });


        var ctx = document.querySelector('#crimeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: Object.values(datasets)
            },
            options: {
                elements: {
                    point: {
                        borderColor: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            text: 'Police Incidents'+(perCapita == true ? ' Per Capita' : ''),
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 40
                        }
                    }
                }
            }
        });
    });


    get( `${domain}/COBRA/${currYear}-aggregate.json`, function(data) 
    {
        // console.log(`${currYear}-aggregate`, data, currMonth)
        aggData = data;
        if( data[currMonth] )
        {
            delete data[currMonth]
        }
        var monthKeys = Object.keys(aggData);

        aggDatasets[currYear][`${currYear}_People`] = { label: `${currYear} Crime Against People`, data: [], tension: 0.2, population: population[currYear] };
        aggDatasets[currYear][`${currYear}_Property`] = { label: `${currYear} Crime Against Property`, data: [], tension: 0.2, population: population[currYear] };
        aggDatasets[currYear][`${currYear}_Total`] = { label: `${currYear} Sum`, data: [], tension: 0.2, population: population[currYear] };
        var max = 0;
        var totalsMax = 0;
        monthKeys.forEach((monthKey) => {
            
                var month = data[monthKey];
                var monthField = month['sum']
                if( type != 'all' && region != null ) {
                    monthField = month[type][region];
                }
                Object.keys(monthField).forEach((crimeKey) => {
                    if( ['ROBBERY-RESIDENCE', 'ROBBERY-PEDESTRIAN', 'ROBBERY-COMMERCIAL'].indexOf(crimeKey) != -1 )
                    {
                        if( !monthField.hasOwnProperty('ROBBERY') )
                        {
                            monthField.ROBBERY = 0;
                        }
                        monthField.ROBBERY += monthField[crimeKey];
                        delete monthField[crimeKey];
                    }
                    if( ['BURGLARY-RESIDENCE', 'BURGLARY-NONRES'].indexOf(crimeKey) != -1 )
                    {
                        if( !month[type][region].hasOwnProperty('BURGLARY') )
                        {
                            month[type][region].BURGLARY = 0;
                        }
                        monthField.BURGLARY += monthField[crimeKey];
                        delete monthField[crimeKey];
                    }
                })
                var totalProperty = 0;
                var totalPeople = 0;
                var total = 0;
                Object.keys(monthField).forEach((crimeKey) => {
                    var crime = monthField[crimeKey];
                    crimeKey = `${currYear} ${crimeKey}`
                    if( !aggDatasets[currYear].hasOwnProperty(crimeKey) )
                    {
                        aggDatasets[currYear][crimeKey] = { label: crimeKey, data: [], tension: 0.2, population: population[currYear] }
                    }
                    var val = (perCapita == true) ? crime/population[currYear]*10000 : crime
                    max = Math.max(max, val);

                    if( crimeKey.includes('AGG ASSAULT') || crimeKey.includes('ROBBERY') || crimeKey.includes('HOMICIDE') || crimeKey.includes('MANSLAUGHTER') )
                    {
                        totalPeople += val;
                        totalsMax = Math.max(totalsMax, totalPeople);
                    }
                    else
                    {
                        totalProperty += val;
                        totalsMax = Math.max(totalsMax, totalProperty);
                    }
                    total += val;
                    aggDatasets[currYear][crimeKey].data.push([monthKey, val])
                    aggDatasets[currYear][crimeKey].data.sort(( a, b ) => {
                        return parseInt(a[0]) - parseInt(b[0])
                    })
                })
                aggDatasets[currYear][`${currYear}_Total`].data.push([monthKey, total])
                aggDatasets[currYear][`${currYear}_Total`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })

                aggDatasets[currYear][`${currYear}_People`].data.push([monthKey, totalPeople])
                aggDatasets[currYear][`${currYear}_People`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
                aggDatasets[currYear][`${currYear}_Property`].data.push([monthKey, totalProperty])
                aggDatasets[currYear][`${currYear}_Property`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
                // datasets.push([year[0], sum])
            
        });

        get(`${domain}/COBRA/${prevYear}-aggregate.json`, function(data) {

            // var monthKeys = Object.keys(data);
            var max = 0;
            aggDatasets[prevYear][`${prevYear}_People`] = { label: `${prevYear} Crime Against People`, data: [], tension: 0.2, population: population[prevYear] };
            aggDatasets[prevYear][`${prevYear}_Property`] = { label: `${prevYear} Crime Against Property`, data: [], tension: 0.2, population: population[prevYear] };
            aggDatasets[prevYear][`${prevYear}_Total`] = { label: `${prevYear} Sum`, data: [], tension: 0.2, population: population[prevYear] };
            
            monthKeys.forEach((monthKey) => {
                var totalProperty = 0;
                var totalPeople = 0;
                var total = 0;
                var month = data[monthKey];
                var monthField = month['sum']
                if( type != 'all' && region != null ) {
                    monthField = month[type][region];
                }
                Object.keys(monthField).forEach((crimeKey) => {
                    var crime = monthField[crimeKey];
                    crimeKey = `${prevYear} ${crimeKey}`
                    if( !aggDatasets[prevYear].hasOwnProperty(crimeKey) )
                    {
                        aggDatasets[prevYear][crimeKey] = { label: crimeKey, data: [], tension: 0.2, population: population[prevYear] }
                    }
                    var val = (perCapita == true) ? crime/population[prevYear]*10000 : crime;
                    if( crimeKey.includes('AGG ASSAULT') || crimeKey.includes('ROBBERY') || crimeKey.includes('HOMICIDE')|| crimeKey.includes('MANSLAUGHTER') )
                    {
                        totalPeople += val;
                        totalsMax = Math.max(totalsMax, totalPeople);
                    }
                    else
                    {
                        totalProperty += val;
                        totalsMax = Math.max(totalsMax, totalProperty);
                    }
                    total += val;

                    aggDatasets[prevYear][crimeKey].data.push([monthKey, val])
                    aggDatasets[prevYear][crimeKey].data.sort(( a, b ) => {
                        return parseInt(a[0]) - parseInt(b[0])
                    })
                })
                aggDatasets[prevYear][`${prevYear}_Total`].data.push([monthKey, total])
                aggDatasets[prevYear][`${prevYear}_Total`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
                aggDatasets[prevYear][`${prevYear}_People`].data.push([monthKey, totalPeople])
                aggDatasets[prevYear][`${prevYear}_People`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
                aggDatasets[prevYear][`${prevYear}_Property`].data.push([monthKey, totalProperty])
                aggDatasets[prevYear][`${prevYear}_Property`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
            });
            
            updateYoYHandler();
            
        })
    });
})
</script>