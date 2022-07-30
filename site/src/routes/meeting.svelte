<svelte:head>
    <title>Meeting Minutes | Civics.City Atlanta</title>
    <meta name="description" content="City Council Meeting Minutes">
    <meta property="og:image" content="https://atlanta.civics.city/default.jpg">
</svelte:head>

<script context="module">
    export const prerender = true;
</script>

<div class="meeting py-4">
    {#if meetingID == '' }
        <AgendaList />
    {:else}    
        <div class="container">
            <div class="row">
                {#if media }
                    <div class="col-12 col-lg-6 mb-3">
                        <h1 id="title">{title}</h1>
                        <p id="subtitle">{subTitle}</p>
                    </div>
                    <div class="col-12 col-lg-6 mb-3">
                        <div class="media"><video controls preload="auto" src="{media}"></video></div>
                    </div>
                {:else}
                    <div class="col-12">
                        <h1 id="title">{title}</h1>
                        <p id="subtitle">{subTitle}</p>
                    </div>
                {/if}
                <div class="col-12">
                    <div class="search form-item">
                        <input type="text" id="search" placeholder="Search" autocomplete="off" on:keyup={searchHandler}>
                    </div>
                    <br>
                    <div id="agenda">
                        {#if agenda == '' }
                        <div class="spinner-border text-info" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        {:else}
                            {@html agenda}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<style>
    .search input {
        width: 100%;
        padding: 10px;
        color: white;
        box-shadow: inset 0 0 5px black;
        background-color: rgba(0,0,0,0.2);
        border: none;
    }
    .form-item input::placeholder {
        line-height: 1;
        color: rgba(255,255,255,.8);
        opacity: 1;
        transition: all .5s linear .5s
    }

    .form-item input:focus::placeholder {
        opacity: 0;
        transition: all 0s linear 0s
    }
    .media video {
        width: 100%;
        aspect-ratio: 4/3;
    }
</style>

<script>
    import { get } from "$lib/_helpers";
    import AgendaList from "$lib/AgendaList.svelte";
    import { onMount } from 'svelte';
    import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
    let agenda = '';
    let meetingID = '';
    let media = '';
    let title = '';
    let subTitle = '';

    onMount(() => {
        var d = document;

        var params = new URLSearchParams(window.location.search);
        var titleCase = function(str) 
        {
            return str.toLowerCase().split(' ').map( function( word ) {
                return (word.charAt(0).toUpperCase() + word.slice(1) );
            }).join(' ');
        };
        document.body.addEventListener('click', function(event) {
            if( event.target.classList.contains( 'toggleheader') ) 
            {
                event.target.parentNode.classList.toggle('active');
            }
        }); 
        // console.log(params.get('minutes'), params.get('agenda'));
        if( params.get('agenda') || params.get('minutes') )
        {
            meetingID = parseInt(params.get('agenda')) || parseInt(params.get('minutes'));
            var notesType = (params.get('agenda')) ? 'agenda':'minutes';
            var childItems = function(items, level)
            {
                var html = '';
                for(var i=0; i<items.length; i++)
                {
                    var item = items[i];
                    var hasChildren = ( item.hasOwnProperty('ChildItems') && item.ChildItems.length > 0 && item.ChildItems[0].ItemType != 'RollCall' );

                    var toggle = (hasChildren ) ? 'toggle' : '';

                    html += '<div class="agenda-'+item.ItemType+' item level-'+level+' '+toggle+'" data-label="'+item.ItemNum+'" data-index="'+i+'">';

                    html += (hasChildren) ? '<div class="title '+toggle+'header">' : '<div class="title">';

                    var toggleIcons = (hasChildren) ? '<span class="toggle-buttons"><i class="material-icons closed">chevron_right</i><i class="material-icons open">expand_more</i></span>' : '<span class="toggle-buttons"><i class="material-icons opacity-0">chevron_right</i></span>';

                    var link = null;
                    if( item.hasOwnProperty('ReferencedItem') )
                    {
                        if( ['Resolution', 'Ordinance'].indexOf(item.ItemType) != -1 )
                        {
                            var title = item.Title.match(/(.*) : (.*)/);

                            html += '<span class="badge white-text">'+title[1]+'</span>';
                            html += toggleIcons+title[2]+' <a data-gaCategory="external" data-gaAction="'+item.ItemType+'" data=gaLabel="http://atlantacityga.iqm2.com/Citizens/Detail_LegiFile.aspx?Frame=SplitView&MeetingID='+meetingID+'&ID='+item.ReferencedItem.ID+'" href="http://atlantacityga.iqm2.com/Citizens/Detail_LegiFile.aspx?Frame=SplitView&MeetingID='+meetingID+'&ID='+item.ReferencedItem.ID+'" target="_blank">('+item.ItemType+')</a>';
                        }
                        else if( ['Communication'].indexOf(item.ItemType) != -1 )
                        {
                            html += item.Title;
                        }
                        else if( ['Attachment'].indexOf(item.ItemType) != -1)
                        {
                            html += '<a data-gaCategory="external" data-gaAction="attachment" data-gaLabel="http://atlantacityga.iqm2.com/Citizens/FileOpen.aspx?Type=4&ID='+item.ReferencedItem.ID+'&Inline=True" href="http://atlantacityga.iqm2.com/Citizens/FileOpen.aspx?Type=4&ID='+item.ReferencedItem.ID+'&Inline=True" target="_blank"><i class="material-icons tiny">attachment</i> '+item.Title+'</a>';
                        }
                    }
                    else
                    {
                        html += toggleIcons+titleCase(item.Title);
                    }
                    html += '</div>';

                    if( hasChildren )
                    {
                        html += '<div class="body">';
                        if( link )
                        {
                            html += '<div class="title">'+link+'</div>';
                        }
                        var newLevel = level+1;
                        html += childItems(item.ChildItems, newLevel);
                        html += '</div>';
                    }
                    html += '</div>';
                }
                return html;
            };

            var url = 'https://br430b48d1.execute-api.us-east-1.amazonaws.com/prod/api/Meeting/'+meetingID+'/Outline';
            get( url, function(result) 
            {
                console.log(result);
                var date = Date.parse(result.Meeting.Date);
                var meetingDate = new Intl.DateTimeFormat('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute: 'numeric', 
                    hour12: true, 
                    timeZone: 'America/New_York', 
                    timeZoneName: 'short' 
                }).format(date);

                var type = (result.hasOwnProperty('Minutes') ) ? 'Minutes':'Agenda';
                title = result.Meeting.Department.Name+' '+type;
                subTitle = meetingDate;
                var items = (result.hasOwnProperty('Minutes')) ? result.Minutes.Outline : result.Agenda.Outline;
                var html =  childItems(items, 1, false);
                agenda = html; 
                
                if( result.hasOwnProperty('Media') && result.Media.hasOwnProperty('StreamURL') )
                {
                    media = result.Media.StreamURL;
                }
            });
        }
    });

    function getParents( elem, selector ) {
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
        }

        // Setup parents array
        var parents = [];

        // Get matching parent elements
        for ( ; elem && elem !== document; elem = elem.parentNode ) {

            // Add matching parents to array
            if ( selector ) {
                if ( elem.matches( selector ) ) {
                    parents.push( elem );
                }
            } else {
                parents.push( elem );
            }

        }

        return parents;
    }

    function searchHandler(event) 
    {
        var d = document;
        d.querySelectorAll('.active').forEach(function(active) {
            active.classList.remove('active');
        });
        d.querySelectorAll('.match').forEach(function(match) {
            match.classList.remove('match');
        });
        d.querySelectorAll('.non-match').forEach(function(nonmatch) {
            nonmatch.classList.remove('non-match');
        });

        if( event.target.value.length > 3 )
        {
            d.querySelectorAll('.title').forEach(function(userItem) {
                userItem.parentNode.classList.add('non-match');
            });
            d.querySelectorAll('.title').forEach(function(userItem) {
                if(userItem.innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 )
                {
                    userItem.parentNode.classList.add('match', 'active');
                    userItem.parentNode.classList.remove('non-match');
                }
            });
            d.querySelectorAll('.match').forEach(function(match) {
                    var parents = getParents(match, 'div.item');
                    parents.forEach(function(parent) {
                        if( parent.querySelector('.body') )
                        {
                            parent.classList.add('active');
                        }
                        parent.classList.remove('non-match');
                    });
            });
            d.getElementById('agenda').classList.add('search');
        }
        else
        {
            d.getElementById('agenda').classList.remove('search');
        }
    }
</script>