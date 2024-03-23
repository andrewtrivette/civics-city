<svelte:head>
    <title>Atlanta Crime Wave | Civics.City Atlanta</title>
    <meta name="description" content="Let's Talk About the Atlanta Crime Wave">
    <meta property="og:title" content="Atlanta Crime Wave | Civics.City Atlanta">
    <meta property="og:image" content="https://atlanta.civics.city/crime-wave.png">
    <meta property="og:description" content="Let's Talk About the Atlanta Crime Wave">
    <meta property="og:url" content="https://atlanta.civics.city/crime-wave">
</svelte:head>

<CrimeWave aggregate={data.aggregate} />
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import CrimeWave from '$lib/CrimeWave.svelte';

    import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>