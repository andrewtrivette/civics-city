<div class="container mt-5">
    <div class="row">
        <div class="col-12 col-lg-3 mt-4">
            <div class="block">
                <div class="title">Incident Group</div>
                <div class="content">            
                    <select class="form-select" name="incidentType" bind:value={source} on:change={updateHandler}>
                        <option value={"violent"} selected>Crimes (People)</option>
                        <option value={"property"}>Crimes (Property)</option>
                        <option value={"1"}>Council District 1</option>
                        <option value={"2"}>Council District 2</option>
                        <option value={"3"}>Council District 3</option>
                        <option value={"4"}>Council District 4</option>
                        <option value={"5"}>Council District 5</option>
                        <option value={"6"}>Council District 6</option>
                        <option value={"7"}>Council District 7</option>
                        <option value={"8"}>Council District 8</option>
                        <option value={"9"}>Council District 9</option>
                        <option value={"10"}>Council District 10</option>
                        <option value={"11"}>Council District 11</option>
                        <option value={"12"}>Council District 12</option>
                    </select>
                </div>
                <div class="title">Time Range</div>
                <div class="content">            
                    <select class="form-select" name="incidentType" bind:value={year} on:change={updateYearHandler}>
                        <option value={"total"} selected>2009-2022</option>
                        <option value={"2021"}>2021</option>
                        <option value={"2020"}>2020</option>
                        <option value={"2019"}>2019</option>
                        <option value={"2018"}>2018</option>
                        <option value={"2017"}>2017</option>
                        <option value={"2016"}>2016</option>
                        <option value={"2015"}>2015</option>
                        <option value={"2014"}>2014</option>
                        <option value={"2013"}>2013</option>
                        <option value={"2012"}>2012</option>
                        <option value={"2011"}>2011</option>
                        <option value={"2010"}>2010</option>
                        <option value={"2009"}>2009</option>
                    </select>
                    <hr>
                    <div class="legend px-2 d-flex justify-content-between align-items-center">
                <span>{((min/13)/5000).toFixed(4)}%</span>
                <span>{((max/13)/5000).toFixed(4)}%</span>
            </div>
            <p class="text-center"><small>(Relative to data range)</small></p>
                </div>
            </div>

            <p><small><a href="https://www.atlantapd.org/i-want-to/crime-data-downloads" target="_blank" rel="noreferrer">Source: APD Crime Data</a></small></p>
            <p><small><a href="https://worldpopulationreview.com/us-cities/atlanta-ga-population" target="_blank" rel="noreferrer">US Census Yearly Population Estimates</a></small></p>
            
            
        </div>
        <div class="col-12 col-lg-9 mt-4">
            <div class="block">
                <div class="title text-center">Crime Trends by Time of Day (% Individual Annual Risk)</div>
                <div class="content">
                    <table id="tod">
                        <tr>
                            <th>Hour</th>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tues</th>
                            <th>Wed</th>
                            <th>Thurs</th>
                            <th>Fri</th>
                            <th>Sat</th>
                        </tr>
                        {#each Object.entries(tod) as row}
                            <tr>
                                <th>{getHour(row[0])}</th>
                                {#each Object.entries(row[1]) as day }
                                <td style="--value: {((((day[1] - min)/(max-min))*180)+120)};">
                                    { ((day[1]/13)/5000).toFixed(4) }%</td>
                                {/each}
                            </tr>
                        {/each}
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<style type="text/css">
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th,
    td {
        font-size: 16px;
        border: none;
        margin: 0;
        padding: 7px 5px;
        text-align: center;
    }
    td {
        --value: 90;
        background-color: hsl( var(--value) 100% 20% );
        color: hsl( calc( 360 - var(--value) ) 100% 95% );
        font-size: 14px;
        width: calc(100% / 8);
        height: 40px;
        
    }
    .legend {
        height: 40px;
        width: 100%;
        background-image: linear-gradient(to right, hsl(120 100% 20%),hsl(165 100% 20%),hsl(210 100% 20%),hsl(255 100% 20%), hsl(300 100% 20%));
        font-size: 14px;
    }
</style>

<script>
    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';
    
    let domain = 'https://civics.city/atlanta/data';
    let source = 'violent';
    let year = 'total';
    let tod = {};
    var max = 0;
    var min = 10000;
    let tempData = null;
    function getHour(val) {
        var d = new Date();
        d.setHours(val);
        return d.toLocaleTimeString('en-us', {hour12: true, hour: '2-digit'})
    }
    function updateHandler() {
        tod = tempData[source]
        max = 0;
        min = 10000;
        Object.entries(tod).map(function(day) {
            Object.entries(day[1]).map( function(hour) {
                max = Math.max(max, hour[1]);
                min = Math.min(min, hour[1]);
            });

        });
        // console.log(max, min)
    }
    function updateYearHandler() {
        get(domain+'/COBRA/'+year+'-tod.json',  function(data) {
            tempData = data;
            
            updateHandler();
        });
    }
    onMount(() => {
        get(domain+'/COBRA/total-tod.json',  function(data) {
            tempData = data;
            
            updateHandler();
        });
    });


</script>