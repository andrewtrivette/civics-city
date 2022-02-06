<div class="block">
    <div class="title">District Statistics</div>
    <div class="content">
        <div>{size}</div>
        <div>{population}</div>
        <div>{density}</div>
        <div><br><canvas id="demoChart" width="400" height="250"></canvas></div>
        <div class="right-align citation"><a href="https://atlantaregional.org/browse/?browse=type&type=data-maps" target="_blank" rel="noreferer noopener">Source ARC GIS</a></div>
    </div>
</div>

<script>
export let id;
import { get } from "$lib/_helpers";
import { onMount } from 'svelte';

let size = '';
let population = '';
let density = '';
let medianAge = '';
let domain = 'https://civics.city/atlanta/data';

onMount(() => {
    init();
});


function init() {
    get( domain+'/demographics/council-district-'+id+'.json', function(result3) 
    {
        // Insert http://documents.atlantaregional.com/AtlantaProfiles/CouncilDistrict9.pdf Additional Demographics
        // console.log(result3);
        var atts = result3.features[0].attributes;
        var demographics = {
            'White': atts.WHITE_P,
            'Black': atts.BLACK_P,
            'Asian': atts.ASIAN_P,
            'Hispanic': atts.HISPANIC_P,
            'Other': atts.OTHER_P
        };
        var pop = atts.TOTAL;
        size = new Intl.NumberFormat().format(parseInt(atts.ACRE))+' Acres';
        population = 'Population: ' + new Intl.NumberFormat().format(parseInt(pop));
        density = (parseInt(pop)/parseInt(atts.ACRE)).toFixed(2)+' People/Acre';

        var ctx = document.querySelector('#demoChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(demographics),
                datasets: [{
                    label: 'Race',
                    data: Object.values(demographics),

                    borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                legend: {
                    position: 'bottom',
                    labels: {
                        fontColor: 'white',
                        boxWidth: 20,
                        fontSize: 14
                    }
                }
            }
        });
    });
}
</script>
