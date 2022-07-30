<svelte:head>
    <title>Atlanta Public Safety | Civics.City Atlanta</title>
    <meta name="description" content="Crime & Public Safety">
    <meta property="og:image" content="https://atlanta.civics.city/public-safety.png">
</svelte:head>

<div class="container mt-4">
    <div class="row">
		<div class="col-12">
			<h1>Atlanta Public Safety</h1>
        </div>
        <div class="col-12 text-center mt-4">
            <a href="/crime-wave" class="btn btn-primary">Crime Data in Context</a>
        </div>
        <div class="col-12">
            <CrimeSummary />
        </div>
    </div>
</div>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
import CrimeSummary from '$lib/CrimeSummary.svelte';
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'

</script>