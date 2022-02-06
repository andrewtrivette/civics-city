<svelte:head>
    <title>Atlanta Crime Wave | Civics.City Atlanta</title>
    <meta property="og:image" content="{assets}/crime-wave.jpg">
</svelte:head>


<CrimeWave />
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
import CrimeWave from '$lib/CrimeWave.svelte';
import { base, assets } from '$app/paths';
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>