<div class="col-12 col-lg-3 mt-4">
    <div class="block">
        <div class="content">
            <div class="input-group mb-2">
                <label class="input-group-text" for="incidentDateStart">Start</label>
                <input class="form-control" id="incidentDateStart" name="incidentDateStart" type="date" bind:value={minDate} min="2017-01-05" on:change={updateData} />
                
            </div>
            <div class="input-group mb-2">
                <label class="input-group-text" for="incidentDateEnd">End</label>
                <input class="form-control" id="incidentDateEnd" name="incidentDateEnd" type="date" bind:value={maxDate} max="2022-12-31"  on:change={updateData} />
                
            </div>
            <select class="form-select mb-2" name="incidentCouncil" bind:value={district} on:change={updateData}>
                <option value={"all"} selected>All Council Districts</option>
                {#each [...Array(12).keys()] as item }
                    <option value={item+1}>District {item+1}</option>
                {/each}
            </select>
            <select class="form-select mb-2" name="incidentPrecinct" bind:value={precinct} on:change={updateData}>
                <option value={"all"} selected>All Police Precincts</option>
                {#each [...Array(7).keys()] as item }
                    <option value={item+1}>Precinct {item+1}</option>
                {/each}
            </select>
        </div>
    </div> 
    <p class="text-center">
        <a data-sveltekit-reload class="btn btn-primary" href="/bike-lane-citations-map/">Map Data</a>
    </p>
    <p class="text-end"><small>Source: Open Records Request by <a href="https://instagram.com/atlantabikegrid/" target="_blank" rel="noreferrer">@atlantabikegrid</a></small></p>
</div>
<div class="col-12 col-lg-9 my-4">

            <div class="row group justify-content-center p-3">
                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">{kpis.citations.toLocaleString('en-US')}</div>
                        <div class="label">Total Citations</div>
                    </div>
                </div>
                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">{incidentFreeDays.toLocaleString('en-US')}</div>
                        <div class="label">Citation-Free Days</div>
                    </div>
                </div>
                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">{((incidentFreeDays/days)*100).toFixed(2).toLocaleString('en-US')}%</div>
                        <div class="label">% Citation-Free Days</div>
                    </div>
                </div>
                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">{(kpis.citations/days).toFixed(2).toLocaleString('en-US')}</div>
                        <div class="label">Average Citations/Day</div>
                    </div>
                </div>   
                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">${kpis.totalFined.toLocaleString('en-US')}</div>
                        <div class="label">Total Fined<br/>(including late fees)</div>
                    </div>
                </div>

                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">${kpis.totalLateFees.toLocaleString('en-US')}</div>
                        <div class="label">Total Late Fees</div>
                    </div>
                </div>

                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">${kpis.totalPaid.toLocaleString('en-US')}</div>
                        <div class="label">Total Paid</div>
                    </div>
                </div>

                <div class="col-6 col-lg-4 text-center mb-4">
                    <div class="kpi">
                        <div class="value">${kpis.totalDue.toLocaleString('en-US')}<sup>*</sup></div>
                        <div class="label">Total Due</div>
                    </div>
                </div>
            </div>
            <div class="row group justify-content-center p-3">
                <div class="block">
                    <div class="title text-center">Fines By Year</div>
                    <div class="content">
                        <div class="chart">
                            <canvas id="finesByYearChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="block">
                    <div class="title text-center">Citations By <select bind:value={citationsBy} on:change={updateData}>
                        <option value="year" selected>Year</option>
                        <option value="month">Month</option>
                        <option value="date">Day Of Month</option>
                        <option value="dayOfWeek">Day Of Week</option>
                    </select></div>
                    <div class="content">
                        <div class="chart">
                            <canvas id="citationsByYearChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
</div>
<div class="col-12">
    <hr /> 
    <p><sup>*</sup> There is gap between Total Paid and Total Due. Presumably these are dismissed citations?</p>
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
import { get, getCSV } from "$lib/_helpers";
import Chart from "chart.js/auto";
import { onMount } from 'svelte';
    
let domain = 'https://s3.amazonaws.com/civics.city/atlanta/data';
var d = new Date();
var currYear = d.getFullYear();
var currMonth = (d.getMonth() + 1 ).toString().padStart(2, '0');
var citations = null;
var citationsChart = null;
var finesChart = null;
var tempCitations = [];
let minDate = "2017-01-01";
let maxDate = '2022-12-31';
let days = (new Date(maxDate) - new Date(minDate))/(1000*60*60*24);
let district = 'all';
let precinct = 'all';
let citationsBy = 'year';
let kpis = {
    citations: 0,
    totalFined: 0,
    totalPaid: 0,
    totalLateFees: 0,
    totalDue: 0
};
let incidentFreeDays = 0;
function updateData()
{
    let dayList = []
    let maxDay = new Date(minDate).getTime();
    tempCitations = citations.filter( item => {
        return (district == 'all' || item.district == district);
    })
    .filter( item => {
        return (precinct == 'all' || item.precinct == precinct);
    })
    .filter(item => {
        var d = new Date(item['Issue Date']);
        var startDate = new Date(minDate);
        var endDate = new Date(maxDate);
        if( dayList.indexOf(d.toDateString()) == -1
        && d >= startDate && d <= endDate ) {
            dayList.push(d.toDateString())
        }
        maxDay = Math.max(maxDay, d.getTime());

        return ( d >= startDate && d < endDate ) ? true : false;
    })
    days = Math.round((new Date(maxDate) - new Date(minDate))/(1000*60*60*24));

    incidentFreeDays = days - (dayList.length);
    console.log({district, precinct, tempCitations})
    if( finesChart )
    {
        finesChart.destroy();
    }
    if( citationsChart )
    {
        citationsChart.destroy();
    }
    kpis = {
        citations: 0,
        totalFined: 0,
        totalPaid: 0,
        totalLateFees: 0,
        totalDue: 0
    };
    tempCitations.forEach((citation, index) => {
        kpis.citations++;
        kpis.totalFined += parseInt(citation['Total Amount Fined'].replace('$', ''));
        kpis.totalPaid += parseInt(citation['Total Cash Paid'].replace('$', ''));
        kpis.totalLateFees += parseInt(citation['Total Late Fees'].replace('$', ''));
        kpis.totalDue += parseInt(citation['Amount Due'].replace('$', ''));
        tempCitations[index].date = new Date(citation['Issue Date']).getDate();
    })

    
    var timeRange = {};
    var totalFinedYears = {};
    var totalPaid = {};
    tempCitations.forEach(citation => {
        let year = citation.year;
        let unit = citation[citationsBy];
        if( !timeRange.hasOwnProperty(unit) )
        {
            timeRange[unit] = 0;
        }
        timeRange[unit]++;
        if( !totalFinedYears.hasOwnProperty(year) )
        {
            totalFinedYears[year] = 0;
        }
        totalFinedYears[year] += parseInt(citation['Total Amount Fined'].replace('$', ''))

        if( !totalPaid.hasOwnProperty(year) )
        {
            totalPaid[year] = 0;
        }
        totalPaid[year] += parseInt(citation['Total Cash Paid'].replace('$', ''))
    })
    Chart.defaults.color = 'white';
    Chart.defaults.font.size = 16;
    var ctx = document.querySelector('#citationsByYearChart').getContext('2d');
    let timeLabels = Object.keys(timeRange)
    if( citationsBy == 'month' )
    {
        timeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
    else if ( citationsBy == 'dayOfWeek' )
    {
        timeLabels = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    }
    citationsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                data: Object.values(timeRange),
                yAxisID: 'yAxis',
                label: 'Citations',
            }]
        },
        options: {
                maintainAspectRatio: false,
                elements: {
                    point: {
                        borderColor: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                scales: {
                    yAxis: {
                        beginAtZero: true,
                        title: {
                            text: 'Citation Count',
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
    var ctx1 = document.querySelector('#finesByYearChart').getContext('2d');
    finesChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: Object.keys(totalFinedYears),
            datasets: [{
               data: Object.values(totalFinedYears),
               yAxisID: 'yAxis',
               label: 'Total Fined' 
            },
            {
               data: Object.values(totalPaid),
               yAxisID: 'yAxis',
               label: 'Paid Fines' 
            }]
        },
        options: {
                maintainAspectRatio: false,
                elements: {
                    point: {
                        borderColor: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                scales: {
                    yAxis: {
                        beginAtZero: true,
                        title: {
                            text: '$ Fines',
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
    get(domain+'/bike-lane-citations.json?1', function(results) {
        
        var keys = results.keys;
        citations = results.values.map( (citation) => {
            var entries = citation.map(( value, index) => {
                return [keys[index], value];
            });
            var citationObj = Object.fromEntries(entries);
            var date = new Date(citationObj['Issue Date']);
            citationObj.year = date.getFullYear();
            citationObj.month = date.getMonth()+1;
            citationObj.dayOfWeek = date.getDay();
            return citationObj;
        })
        // console.log({citations})

        updateData();
        
        
        var results1 = citations.reduce((prevVal, currVal, currIndex) => prevVal+parseInt(currVal['Amount Due'].replace('$', '')), 0)

        console.log({results1})
        
    });
})
</script>