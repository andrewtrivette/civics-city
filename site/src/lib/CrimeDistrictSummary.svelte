        <p class="text-center">Historical Crime Trend</p>
        <div>
            <canvas id="crimeChart" width="400" height="600"></canvas>
        </div>
        <br />
        <hr/>
        <p class="text-center">2022 Crime by Month</p>
        <div>
            <canvas id="crimeChart1" width="400" height="600"></canvas>
        </div>
        <br/>
        <hr/>
        <p class="text-center">YoY Crime Trends by Month</p>
        <div>
            <canvas id="crimeChart2" width="400" height="600"></canvas>
        </div>


<div class="col-12 mt-3 text-center">
    <a href="https://www.atlantapd.org/i-want-to/crime-data-downloads" target="_blank">Source: APD Crime Data</a>
    <a href="https://worldpopulationreview.com/us-cities/atlanta-ga-population" target="_blank">US Census Yearly Population Estimates</a>
</div>


<script>
    export let type;
    export let region;
    import { get } from "$lib/_helpers";
    import Chart from "chart.js/auto/auto.js";
    import annotationPlugin from 'chartjs-plugin-annotation';
    import { onMount } from 'svelte';

let domain = 'https://civics.city/atlanta/data';

onMount(() => {
    init();
});

var d = new Date();
var currYear = d.getFullYear();
var currMonth = (d.getMonth() + 1 ).toString().padStart(2, '0');
function init() {
    Chart.register(annotationPlugin);
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
        var datasets = {};
        
        yearKeys.forEach((yearKey) => {
            
            var year = data[yearKey];
            Object.keys(year[type][region]).forEach((crimeKey) => {
                if( ['ROBBERY-RESIDENCE', 'ROBBERY-PEDESTRIAN', 'ROBBERY-COMMERCIAL'].indexOf(crimeKey) != -1 )
                {
                    if( !year[type][region].hasOwnProperty('ROBBERY') )
                    {
                        year[type][region].ROBBERY = 0;
                    }
                    year[type][region].ROBBERY += year[type][region][crimeKey];
                    delete year[type][region][crimeKey];
                }
                if( ['BURGLARY-RESIDENCE', 'BURGLARY-NONRES'].indexOf(crimeKey) != -1 )
                {
                    if( !year[type][region].hasOwnProperty('BURGLARY') )
                    {
                        year[type][region].BURGLARY = 0;
                    }
                    year[type][region].BURGLARY += year[type][region][crimeKey];
                    delete year[type][region][crimeKey];
                }
            })
            Object.keys(year[type][region]).forEach((crimeKey) => {
                var crime = year[type][region][crimeKey];
                if( !datasets.hasOwnProperty(crimeKey) )
                {
                    datasets[crimeKey] = { label: crimeKey, data: [], tension: 0.2 }
                }
                var val = crime;
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
                            text: 'Police Incidents',
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
        console.log('year-aggregate', data)
        if( data[currMonth] )
        {
            delete data[currMonth]
        }
        var monthKeys = Object.keys(data);
        var datasets = {};
        var totals = {};
        totals[`${currYear}_People`] = { label: `${currYear} Crime Against People`, data: [], tension: 0.2 };
        totals[`${currYear}_Property`] = { label: `${currYear} Crime Against Property`, data: [], tension: 0.2 };
        var max = 0;
        var totalsMax = 0;
        monthKeys.forEach((monthKey) => {
            
                var month = data[monthKey];
                Object.keys(month[type][region]).forEach((crimeKey) => {
                    if( ['ROBBERY-RESIDENCE', 'ROBBERY-PEDESTRIAN', 'ROBBERY-COMMERCIAL'].indexOf(crimeKey) != -1 )
                    {
                        if( !month[type][region].hasOwnProperty('ROBBERY') )
                        {
                            month[type][region].ROBBERY = 0;
                        }
                        month[type][region].ROBBERY += month[type][region][crimeKey];
                        delete month[type][region][crimeKey];
                    }
                    if( ['BURGLARY-RESIDENCE', 'BURGLARY-NONRES'].indexOf(crimeKey) != -1 )
                    {
                        if( !month[type][region].hasOwnProperty('BURGLARY') )
                        {
                            month[type][region].BURGLARY = 0;
                        }
                        month[type][region].BURGLARY += month[type][region][crimeKey];
                        delete month[type][region][crimeKey];
                    }
                })
                var totalProperty = 0;
                var totalPeople = 0;
                Object.keys(month[type][region]).forEach((crimeKey) => {
                    var crime = month[type][region][crimeKey];
                    if( !datasets.hasOwnProperty(crimeKey) )
                    {
                        datasets[crimeKey] = { label: crimeKey, data: [], tension: 0.2 }
                    }
                    var val = crime;
                    max = Math.max(max, val);

                    if( crimeKey.includes('AGG ASSAULT') || crimeKey.includes('ROBBERY') || crimeKey.includes('HOMICIDE') )
                    {
                        totalPeople += val;
                        totalsMax = Math.max(totalsMax, totalPeople);
                    }
                    else
                    {
                        totalProperty += val;
                        totalsMax = Math.max(totalsMax, totalProperty);
                    }

                    datasets[crimeKey].data.push([monthKey, val])
                    datasets[crimeKey].data.sort(( a, b ) => {
                        return parseInt(a[0]) - parseInt(b[0])
                    })
                })
                totals[`${currYear}_People`].data.push([monthKey, totalPeople])
                totals[`${currYear}_People`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
                totals[`${currYear}_Property`].data.push([monthKey, totalProperty])
                totals[`${currYear}_Property`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
                // datasets.push([year[0], sum])
            
        });
        console.log({totals})
        console.log(datasets);

       
        var ctx = document.querySelector('#crimeChart1').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(data).sort(),
                datasets: Object.values( datasets )
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
                            text: 'Police Incidents',
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

        var prevYear = currYear - 1;
        get(`${domain}/COBRA/${prevYear}-aggregate.json`, function(data) {

            var monthKeys = Object.keys(data);
            var max = 0;
            totals[`${prevYear}_People`] = { label: `${prevYear} Crime Against People`, data: [], tension: 0.2 };
            totals[`${prevYear}_Property`] = { label: `${prevYear} Crime Against Property`, data: [], tension: 0.2 };

            
            monthKeys.forEach((monthKey) => {
                var totalProperty = 0;
                var totalPeople = 0;
                var month = data[monthKey];
                Object.keys(month[type][region]).forEach((crimeKey) => {
                    var crime = month[type][region][crimeKey];
                    var val = crime;
                    if( crimeKey.includes('AGG ASSAULT') || crimeKey.includes('ROBBERY') || crimeKey.includes('HOMICIDE') )
                    {
                        totalPeople += val;
                        totalsMax = Math.max(totalsMax, totalPeople);
                    }
                    else
                    {
                        totalProperty += val;
                        totalsMax = Math.max(totalsMax, totalProperty);
                    }
                })
                totals[`${prevYear}_People`].data.push([monthKey, totalPeople])
                totals[`${prevYear}_People`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
                totals[`${prevYear}_Property`].data.push([monthKey, totalProperty])
                totals[`${prevYear}_Property`].data.sort(( a, b ) => {
                    return parseInt(a[0]) - parseInt(b[0])
                })
            });
            

            var ctx = document.querySelector('#crimeChart2').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(data).sort(),
                    datasets: Object.values( totals )
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
                                text: 'Police Incidents',
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
        })
    });
}
</script>