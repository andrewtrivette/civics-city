<svelte:head>
    <title>City Council Member | Civics.City Atlanta</title>
    <meta property="og:image" content="%svelte.assets%/default.jpg">
</svelte:head>
<script context="module">
    export async function load({ url, params }) {
      return {
        props: { params }
      };
    }
</script>
<script>
    import { onMount } from 'svelte';
    import MemberProfile from "$lib/MemberProfile.svelte";
    export const prerender = true;
    import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
    export let params;
    let id = params.id;
    onMount(() => {

// 

    });
        
    
</script>
    
<MemberProfile id={id} />
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />