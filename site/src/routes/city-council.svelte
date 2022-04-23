<svelte:head>
    <title>City Council Districts | Civics.City Atlanta</title>
    <meta property="og:image" content="https://atlanta.civics.city}/default.jpg">
</svelte:head>

<div class="container pt-5">
    <div class="row">
		<div class="col-12">
			<h1>Atlanta City Council Districts</h1>
        </div>
        <Represents type="districts" showControls={false} />
    </div>
</div>

<div class="councilmembers section">
    <div class="container">
        <a name="members"></a>
		<div class="row justify-content-center">
			<div class="col-12 text-center mb-4">
				<h3>City Council Members</h3>
			</div>
            <CouncilMembers/>
        </div>
    </div>
</div>
<a name="agendas"></a>
<div class="agenda section">
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
import { onMount } from 'svelte';
import { base, assets } from '$app/paths';
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
onMount(() => {


});
</script>