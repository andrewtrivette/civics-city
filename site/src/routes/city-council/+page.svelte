<svelte:head>
    <title>City Council Districts | Civics.City Atlanta</title>
	<meta name="description" content="Atlanta City Council">
    <meta property="og:image" content="https://atlanta.civics.city/city-council.png">
</svelte:head>

<div class="container pt-5">
    <div class="row">
		<div class="col-12">
			<h1>Atlanta City Council Districts</h1>
        </div>
        <Represents type="districts" showControls={false} />
    </div>
</div>

<div class="councilmembers section" id="members">
    <div class="container">
		<div class="row justify-content-center">
			<div class="col-12 text-center mb-4">
				<h3>City Council Members</h3>
			</div>
            <CouncilMembers/>
        </div>
    </div>
</div>
<div class="agenda section" id="agendas">
	<AgendaList />
</div>

<style>

	.agenda {
		background-color: #360030;
	}
	.councilmembers {
		background-color: #151515;
	}
</style>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
    import AgendaList from "$lib/AgendaList.svelte";
	import Represents from '$lib/Represents.svelte';
	import CouncilMembers from "$lib/CouncilMembers.svelte";
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>