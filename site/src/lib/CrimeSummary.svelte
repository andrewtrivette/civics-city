<div class="col-12 mt-4">
    <div class="block">
        <div class="title text-center">2009 - 2021 Crime Trends Per Capita</div>
        <div class="content">
            <div id="crime">
                <canvas id="crimeChart" width="400" height="200"></canvas>
            </div>
            <div class="text-end">
                <small><a href="https://www.atlantapd.org/i-want-to/crime-data-downloads" target="_blank">Source: APD Crime Data</a>
                <a href="https://worldpopulationreview.com/us-cities/atlanta-ga-population" target="_blank">US Census Yearly Population Estimates</a></small>
            </div>
        </div>
    </div>
</div>


<script>
    import { get } from "$lib/_helpers";
    import Chart from "chart.js/auto/auto.js";
    import { onMount } from 'svelte';

let domain = 'https://civics.city/atlanta/data';

onMount(() => {
    var population = {
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
        console.log(Object.values(datasets));
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
                scales: {
                    y: {
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
})
</script>