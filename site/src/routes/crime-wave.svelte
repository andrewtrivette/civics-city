<svelte:head>
    <title>Atlanta Crime Wave | Civics.City Atlanta</title>
    <meta name="description" content="Let's Talk About the Atlanta Crime Wave">
    <meta property="og:title" content="Atlanta Crime Wave | Civics.City Atlanta">
    <meta property="og:image" content="https://atlanta.civics.city/crime-wave.jpg">
    <meta property="og:description" content="Let's Talk About the Atlanta Crime Wave">
    <meta property="og:url" content="https://atlanta.civics.city/crime-wave">
</svelte:head>


<CrimeWave />
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
import CrimeWave from '$lib/CrimeWave.svelte';
import { base, assets } from '$app/paths';
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>