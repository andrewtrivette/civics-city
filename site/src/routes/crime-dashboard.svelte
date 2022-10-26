<svelte:head>
    <title>Atlanta Crime | Civics.City Atlanta</title>
    <meta name="description" content="Crime Trend Statistics">
    <meta property="og:image" content="https://atlanta.civics.city/crime-dashboard.png">
</svelte:head>

<div class="container mt-4">
    <div class="row mb-5">
		<div class="col-12 text-center">
			<h1>Atlanta Crime Statistics</h1>
        </div>
        <div class="col-12 text-center mt-4">
            <a href="/crime-wave" class="btn btn-primary">Crime Data in Context</a>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="block">
                <div class="title">Crime Trends</div>
                <div class="content">
                    <CrimeSummary type="all" perCapita={true} />
                </div>
            </div>
        </div>
    </div>
</div>
<CrimeTimeOfDay />
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
import CrimeSummary from '$lib/CrimeSummary.svelte';
import CrimeTimeOfDay from '$lib/CrimeTimeOfDay.svelte';
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'

</script>