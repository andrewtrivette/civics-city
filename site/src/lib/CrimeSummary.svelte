<div class="col-12 mt-4">
    <div class="block">
        <div class="title text-center">2009 - 2021 Crime Trends Per Capita</div>
        <div class="content">
            <div id="crime" class="chart">
                <canvas id="crimeChart"></canvas>
            </div>
            <div class="text-end">
                <small><a href="https://www.atlantapd.org/i-want-to/crime-data-downloads" target="_blank">Source: APD Crime Data</a>
                <a href="https://worldpopulationreview.com/us-cities/atlanta-ga-population" target="_blank">US Census Yearly Population Estimates</a></small>
            </div>
        </div>
    </div>
    <br/>
    <div class="block">
        <div class="title text-center">{currYear} Crime Trends By Month</div>
        <div class="content">
            <div id="crime1" class="chart">
                <canvas id="crimeChart1"></canvas>
            </div>
            <div class="text-end">
                <small><a href="https://www.atlantapd.org/i-want-to/crime-data-downloads" target="_blank">Source: APD Crime Data</a></small>
            </div>
        </div>
    </div>
</div>


<script>
    import { get } from "$lib/_helpers";
    import Chart from "chart.js/auto/auto.js";
    import { onMount } from 'svelte';

let domain = 'https://civics.city/atlanta/data';
var d = new Date();
var currYear = d.getFullYear();
var currMonth = (d.getMonth() + 1 ).toString().padStart(2, '0');

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
            Object.keys(year.sum).forEach((crimeKey) => {
                if( ['ROBBERY-RESIDENCE', 'ROBBERY-PEDESTRIAN', 'ROBBERY-COMMERCIAL'].indexOf(crimeKey) != -1 )
                {
                    if( !year.sum.hasOwnProperty('ROBBERY') )
                    {
                        year.sum.ROBBERY = 0;
                    }
                    year.sum.ROBBERY += year.sum[crimeKey];
                    delete year.sum[crimeKey];
                }
                if( ['BURGLARY-RESIDENCE', 'BURGLARY-NONRES'].indexOf(crimeKey) != -1 )
                {
                    if( !year.sum.hasOwnProperty('BURGLARY') )
                    {
                        year.sum.BURGLARY = 0;
                    }
                    year.sum.BURGLARY += year.sum[crimeKey];
                    delete year.sum[crimeKey];
                }
            })
            Object.keys(year.sum).forEach((crimeKey) => {
                var crime = year.sum[crimeKey];
                if( !datasets.hasOwnProperty(crimeKey) )
                {
                    datasets[crimeKey] = { label: crimeKey, data: [], tension: 0.2 }
                }
                var val = crime/population[yearKey]*10000;
                datasets[crimeKey].data.push([yearKey, val])
            })
            // datasets.push([year[0], sum])
            
        });
        // console.log(Object.values(datasets));
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
                        max: 300,
                        title: {
                            text: 'Police Incidents per 10,000',
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
        if( data[currMonth] )
        {
            delete data[currMonth]
        }
        var monthKeys = Object.keys(data);
        var datasets = {};
        var max = 0;
        monthKeys.forEach((monthKey) => {
            
                var month = data[monthKey];
                Object.keys(month.sum).forEach((crimeKey) => {
                    if( ['ROBBERY-RESIDENCE', 'ROBBERY-PEDESTRIAN', 'ROBBERY-COMMERCIAL'].indexOf(crimeKey) != -1 )
                    {
                        if( !month.sum.hasOwnProperty('ROBBERY') )
                        {
                            month.sum.ROBBERY = 0;
                        }
                        month.sum.ROBBERY += month.sum[crimeKey];
                        delete month.sum[crimeKey];
                    }
                    if( ['BURGLARY-RESIDENCE', 'BURGLARY-NONRES'].indexOf(crimeKey) != -1 )
                    {
                        if( !month.sum.hasOwnProperty('BURGLARY') )
                        {
                            month.sum.BURGLARY = 0;
                        }
                        month.sum.BURGLARY += month.sum[crimeKey];
                        delete month.sum[crimeKey];
                    }
                })
                Object.keys(month.sum).forEach((crimeKey) => {
                    var crime = month.sum[crimeKey];
                    if( !datasets.hasOwnProperty(crimeKey) )
                    {
                        datasets[crimeKey] = { label: crimeKey, data: [], tension: 0.2 }
                    }
                    var val = crime;
                    max = Math.max(max, val);
                    datasets[crimeKey].data.push([monthKey, val])
                })
                // datasets.push([year[0], sum])
            
        });
        console.log(datasets);
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

        var ctx = document.querySelector('#crimeChart1').getContext('2d');
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
})
</script>