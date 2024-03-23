

<script>
    /** @type {import('./$types').PageData} */
    export let data;
    let id = data.params.id;
    import DistrictDemographics from "$lib/DistrictDemographics.svelte";
    import DistrictMap from "$lib/DistrictMap.svelte";
    import DistrictCouncil from "$lib/DistrictCouncil.svelte";
    import CrimeSummary from "$lib/CrimeSummary.svelte";
    import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>
    
<svelte:head>
    <title>City Council District {id} | Civics.City Atlanta</title>
    <meta property="og:image" content="https://atlanta.civics.city/default.jpg">    
</svelte:head>

<div class="container">
    <div class="row">
        <div class="col-12">
            <br>
            <h4>City Council District {id}</h4>
        </div>
        <div class="col-12 col-lg-4">
            <DistrictDemographics id={id} />
        </div>
        
        <div class="col-12 col-lg-8">
            <div class="block">
                <div class="title">District Boundaries</div>
                <DistrictMap id={id} />
            </div>
        </div>
        <DistrictCouncil id={id} />
        <div class="col-12 col-lg-7">
            <div class="block">
                <div class="title">District Crime Trends</div>
                <div class="content">
                    <CrimeSummary type="district" region={id} />
                </div>
                
            </div>
        </div>
    </div>
</div>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />