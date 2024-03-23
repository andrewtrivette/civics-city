<svelte:head>
	<title>Demographics | Civics.City Atlanta</title>
	<meta property="og:image" content="https://atlanta.civics.city/default.jpg">
	<meta name="description" content="Atlanta Demographics">
    <meta property="og:title" content="Demographics | Civics.City Atlanta">
    <meta property="og:url" content="https://atlanta.civics.city/demographics/">
	<link
		rel="stylesheet"
		href="//unpkg.com/leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css"
		type="text/css"
	/>
	<script src="//unpkg.com/leaflet-gesture-handling"></script>
</svelte:head>

<script context="module">
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>

<div class="demographics section">
	<div class="container">
		<div class="row">
			<div class="col-12 text-center">
				<h3>Atlanta By The Numbers</h3>
			</div>
			<!-- <Demographics /> -->
			<!-- <CDIAMap /> -->
			<NeighborhoodMap />
		</div>
	</div>
</div>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
	import Demographics from "$lib/Demographics.svelte";
	import CDIAMap from "$lib/CDIAMap.svelte";
	import NeighborhoodMap from '$lib/NeighborhoodMap.svelte';
</script>