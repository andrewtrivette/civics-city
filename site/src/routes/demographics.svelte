<svelte:head>
	<title>Demographics | Civics.City Atlanta</title>
	<meta property="og:image" content="https://atlanta.civics.city/default.jpg">
	<meta name="description" content="Government Impacts Everyone">
    <meta property="og:title" content="Demographics | Civics.City Atlanta">
    <meta property="og:url" content="https://atlanta.civics.city/demographics">
</svelte:head>

<script context="module">
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
	export const prerender = true;
</script>

<div class="demographics section">
	<div class="container">
		<div class="row">
			<div class="col-12 text-center">
				<h3>Atlanta By The Numbers</h3>
			</div>
			<Demographics />
		</div>
	</div>
</div>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
	import Demographics from "$lib/Demographics.svelte";
</script>