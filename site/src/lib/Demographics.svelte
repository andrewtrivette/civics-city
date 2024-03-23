<div class="col-12 col-lg-6 mt-4">
    <div class="block">
        <div class="content">
            <div class="row group justify-content-center mt-3">
                <div class="col-6 text-center mb-4">
                    <div class="kpi">
                        <div class="value">{population}</div>
                        <div class="label">Population</div>
                    </div>
                </div>
            </div>
            <br><hr/><br>
            <div id="age">
                <h4 class="text-center">Age %</h4>
                <canvas id="ageChart" width="400" height="200"></canvas>
            </div>
            <br><hr/><br>
            <div id="demographics">
                <h4 class="text-center">Race %</h4>
                <canvas id="demoChart" width="400" height="200"></canvas>
            </div>
            <br><hr/><br>
            
            <div id="gender">
                <h4 class="text-center">Gender %</h4>
                <canvas id="genderChart" width="400" height="200"></canvas>
            </div>
            <br><hr/><br>
            <p><a href="https://opendata.atlantaregional.com/datasets/coaplangis::cdia?geometry=-85.412%2C33.543%2C-83.343%2C33.943" target="_blank"  rel="noreferrer">Poverty Map (CDIA's) <i class="material-icons tiny">open_in_new</i></a></p>
            <p><a href="https://garc.maps.arcgis.com/apps/webappviewer/index.html?id=c36bb3b8c0744aa7a04a52031473790a" target="_blank" rel="noreferrer">Gentrification Risk Map <i class="material-icons tiny">open_in_new</i></a></p>
        </div>
    </div>
</div>
<div class="col-12 col-lg-6 mt-4">
    <div class="block">
        <div class="content">
            {#each Object.entries(kpis) as [groupLabel, group](groupLabel)}
                <div class="row group justify-content-center mt-3">
                    <div class="col-12 text-center">
                        <h4>{groupLabel}</h4>
                    </div>
                    {#each Object.entries(group) as [label, value](label)}
                        <div class="col-6 col-lg-4 text-center mb-4">
                            <div class="kpi">
                                <div class="value">{value}</div>
                                <div class="label">{label}</div>
                            </div>
                        </div>
                        
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
<div class="col-12 mt-3 text-center">
    <a href="https://www.census.gov/quickfacts/fact/table/atlantacitygeorgia/POP010220" target="_blank" rel="noreferrer">Source: US Census Bureau.</a> Numbers primarily cover 2015-2019
</div>
<!-- <div class="col-12 mt-3 text-center">
    <div class="block">
        <div class="title text-center">CDIA Districts (Census blocks that are at or below 80% of the regions average income)</div>
        <div class="content">
            <CDIAMap />
        </div>
    </div>
</div> -->

<script>
    // export let ready;
    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';
    import Chart from "chart.js/auto";
    // import CDIAMap from "$lib/CDIAMap.svelte"
// let chartReady = ( typeof Chart != 'undefined');
let population = '';
let domain = 'https://civics.city/atlanta/data';
let filters = [ "Population_2020", "Population_2010", "Age", "Gender", "Race", "Characteristics", "Economy", "Firms", "Geography"];
let kpis = {};
onMount(() => {
    init();
});


function init() {
    get( domain+'/demographics.json', function(data) 
    {
        var sections = Object.entries(data);
        var filtered = sections.filter(([key, value]) => filters.indexOf(key) == -1);
        kpis = Object.fromEntries(filtered);
        // console.log(kpis);
        population = data['Population_2020'];

        // Chart.overrides.bar.borderRadius = 3;
        var backgroundColor = [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 192, 86, 1)'
                    ]
        var ctx = document.querySelector('#demoChart').getContext('2d');
        Chart.defaults.color = 'white';
        Chart.defaults.font.size = 16;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data.Race),
                datasets: [{
                    data: Object.values(data.Race),
                    backgroundColor
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        var ctx = document.querySelector('#ageChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data.Age),
                datasets: [{
                    data: Object.values(data.Age),
                    backgroundColor
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }); 
        var ctx = document.querySelector('#genderChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data.Gender),
                datasets: [{
                    data: Object.values(data.Gender),
                    backgroundColor
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }); 
    });
}
</script>