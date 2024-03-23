<svelte:head>
    <title>Legislation | Civics.City Atlanta</title>
    <meta name="description" content="City Council Legislation">
    <meta property="og:image" content="https://atlanta.civics.city/default.jpg">
</svelte:head>

<div class="legislation py-4">

    <div class="container">
        {#if output == '' }
            <div class="row">
                <div class="col-12">
                    <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        {:else}
            <div class="row">
                <div class="col-12">
                    <h1 id="title">{output.fileType} {output.resNum}</h1>
                    <p class="lead text-end">{output.status} - {output.date}</p>
                </div>
            </div>
            <details open>
                <summary>Summary</summary>
                <div class="row justify-content-center">
                    <div class="col col-lg-9">
                        {#each output.title.split(';') as line }
                            <p class="lead">{line}</p>
                        {/each}
                    </div>
                </div>
            </details>
            <details>
                <summary>Body</summary>
                <div class="row justify-content-center">
                    <div class="col-lg-9 lead">
                        {@html output.body.join('')}
                    </div>
                </div>
            </details>
            <details>
                <summary>History & Attachments</summary>
                <div class="row">
                    <div class="col-12">
                        <br>
                        <h2>History</h2>
                    </div>
                    {#each output.history as history }
                        <div class="col-12 d-lg-flex">
                            <a href="{history.meetingLink.replace('/Citizens/Detail_Meeting.aspx?ID=', '/meeting/?minutes=')}" class="date flex-shrink-0 me-3">
                                <div class="cal">
                                    <span class="month">{new Date(history.date).toLocaleDateString('en-US', { month: 'short'})}</span>
                                    <span class="day">{new Date(history.date).getDate()}</span>
                                    <span class="year">{new Date(history.date).getFullYear()}</span>
                                </div>
                            </a>
                            <div>
                                <h3><a href="{history.meetingLink.replace('/Citizens/Detail_Meeting.aspx?ID=', '/meeting/?minutes=')}">{history.committee}</a></h3>
                                {@html history.VoteResult}
                            </div>
                        </div>
                        <div class="col-12"><hr></div>
                    {/each}
                    <div class="col-12">
                        <br><br>
                        <h2>Attachments</h2>
                        {#each output.attachments as attachment }
                            <p><a href="{attachment.link}" target="_blank" rel="noreferrer noopener">{attachment.label}</a></p>
                        {/each}
                    </div>
                    <div class="col-12">
                        <br><br>
                        <h2>Categories</h2>
                        {#each Object.entries(output.info) as [title, val]}
                            {#if val }
                                <p><b>{title}</b> {val}</p>
                            {/if}
                        {/each}
                    </div>
                </div>
            </details>
        {/if}
    </div>
</div>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
    import { get } from "$lib/_helpers";
    import { onMount } from 'svelte';
    import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
    let output = '';

    onMount(() => {
        var d = document;

        var params = new URLSearchParams(window.location.search);
        console.log(params)
        var titleCase = function(str) 
        {
            return str.toLowerCase().split(' ').map( function( word ) {
                return (word.charAt(0).toUpperCase() + word.slice(1) );
            }).join(' ');
        };

        if( params.get('id') )
        {

            var url = 'https://fuqnoz5skh.execute-api.us-east-1.amazonaws.com/Citizens/Detail_LegiFile.aspx?Frame=SplitView&ID='+params.get('id');
            get( url, function(result) 
            {
                console.log(result);

                output = result;
            });
        }
    });
</script>