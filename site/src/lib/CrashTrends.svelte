<div class="col-12 mt-4">
    <div class="block">
        <div class="title text-center">Crash Trend</div>
        <div class="content">
            <div class="chart">
                <canvas id="crashChart"></canvas>
            </div>
        </div>
    </div>
    <p class="text-end"><small>Source: <a href="http://www.dot.ga.gov/DS/Crash" target="_blank" rel="noreferrer">GDOT Crash Data</a></small></p>
</div>
<div class="col-12 mt-4">
    <div class="block">
        <div class="title text-center">Crash Trends Age</div>
        <div class="content">
            <div class="chart">
                <canvas id="crashChart1"></canvas>
            </div>
            
        </div>
    </div>
    <p class="text-end"><small>Source: <a href="http://www.dot.ga.gov/DS/Crash" target="_blank" rel="noreferrer">GDOT Crash Data</a></small></p>
</div>
<div class="col-12 mt-4">
    <div class="block">
        <div class="title text-center">Crash Trend Factors</div>
        <div class="content">
            <div class="chart">
                <canvas id="crashChart2"></canvas>
            </div>
        </div>
    </div>
    <p class="text-end"><small>Source: <a href="http://www.dot.ga.gov/DS/Crash" target="_blank" rel="noreferrer">GDOT Crash Data</a></small></p>
</div>
<div class="col-12 mt-4">
    <div class="block">
        <div class="title text-center">Crash Trend Characteristics</div>
        <div class="content">
            <div class="chart">
                <canvas id="crashChart3"></canvas>
            </div>
        </div>
    </div>
    <p class="text-end"><small>Source: <a href="http://www.dot.ga.gov/DS/Crash" target="_blank" rel="noreferrer">GDOT Crash Data</a></small></p>
</div>
<div class="col-12 mt-4">
    <div class="block">
        <div class="title text-center">Crash Trend Injuries</div>
        <div class="content">
            <div class="chart">
                <canvas id="crashChart4"></canvas>
            </div>
        </div>
    </div>
    <p class="text-end"><small>Source: <a href="http://www.dot.ga.gov/DS/Crash" target="_blank" rel="noreferrer">GDOT Crash Data</a></small></p>
</div>


<style type="text/css">

.chart canvas {
    width: 800px;
    height: 400px;
}
@media (min-width: 768px) {
    .chart canvas {
        height: 800px;
    }
}
</style>

<script>
import { get } from "$lib/_helpers";
import Chart from "chart.js/auto";
import { onMount } from 'svelte';
    
let domain = 'https://s3.amazonaws.com/civics.city/atlanta/data';
var d = new Date();
var currYear = d.getFullYear();
var currMonth = (d.getMonth() + 1 ).toString().padStart(2, '0');

onMount(() => {
    Chart.defaults.color = 'white';
    Chart.defaults.font.size = 16;
    var colors = [
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
    Chart.overrides.line.borderColor = colors;
    Chart.overrides.bar.backgroundColor = colors;
    get( domain+'/gdot/total-summary.json?1', function(results) 
    {
        
        var data = results.yearTotals;
        var yearKeys = Object.keys(data);
        var datasets = {};
        
        yearKeys.forEach((yearKey) => {
            
            var year = data[yearKey];

            Object.keys(year).forEach((typeKey) => {
                if( !datasets.hasOwnProperty(typeKey) )
                {
                    datasets[typeKey] = { label: typeKey, data: [], tension: 0.2 }
                }
                var val = year[typeKey];
                datasets[typeKey].data.push([yearKey, val])
            })
        });
        var allGroup = ['All Crashes']
        var allDataset = Object.fromEntries(Object.entries(datasets).filter(item => {
            return allGroup.includes(item[0])
        }))
        var ctx = document.querySelector('#crashChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: Object.values(allDataset)
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
                        // max: 300,
                        title: {
                            text: 'Incidents',
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


        var ageGroups = ['Young Adult Driver (Age 20-24)', 'Young Driver (Age 15-19)', 'Older Driver (55-64)', 'Older Driver (65+)']
        var ageDataset = Object.fromEntries(Object.entries(datasets).filter(item => {
            return ageGroups.includes(item[0])
        }))
        var ctx1 = document.querySelector('#crashChart1').getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: Object.values(ageDataset)
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
                        // max: 300,
                        title: {
                            text: 'Incidents',
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

        var factorGroups = ['Distracted Driver (Suspected)', 'Intersection Related', 'Roadway Departure', 'Aggressive Driving', 'Speed Related', 'Impaired Driving (Confirmed)', 'Impaired (Suspected)', 'Distracted Driver (Confirmed)']
        var factorsDataset = Object.fromEntries(Object.entries(datasets).filter(item => {
            return factorGroups.includes(item[0])
        }))
        var ctx2 = document.querySelector('#crashChart2').getContext('2d');
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: Object.values(factorsDataset)
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
                        // max: 300,
                        title: {
                            text: 'Incidents',
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

        var charsGroups = ['Pedestrian', 'Bicycle', 'Motorcycle']
        var charsDataset = Object.fromEntries(Object.entries(datasets).filter(item => {
            return charsGroups.includes(item[0])
        }))
        var ctx3 = document.querySelector('#crashChart3').getContext('2d');
        new Chart(ctx3, {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: Object.values(charsDataset)
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
                        // max: 300,
                        title: {
                            text: 'Incidents',
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
// console.log(Object.keys(datasets));
        var injuryGroups = ["(O) No Injury", "(C) Possible Injury / Complaint", "(B) Suspected Minor/Visible Injury", "(A) Suspected Serious Injury", "(K) Fatal Injury"]
        var injuryDataset = Object.fromEntries(Object.entries(datasets).filter(item => {
            return injuryGroups.includes(item[0])
        }))
        var ctx4 = document.querySelector('#crashChart4').getContext('2d');
        new Chart(ctx4, {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: Object.values(injuryDataset).reverse()
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
                        // max: 300,
                        title: {
                            text: 'Incidents',
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