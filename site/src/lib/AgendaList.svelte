<div class="container">
    <div class="row">
        <div class="col-12 text-center mb-4">
            <h3>Agendas & Minutes</h3>
        </div>
        <div class="col-12 col-lg-6">
            <div class="block">
                <div class="title">Upcoming Meetings</div>
                <div class="content">
                    <div class="list council">
                        {#each councilUpcoming as item (item.Meeting.ID) }
                            <div class="item level-1">
                                <div class="date">
                                    <div class="cal">
                                        <span class="month">{item.Meeting.Date[0]}</span>
                                        <span class="day">{item.Meeting.Date[1]}</span>
                                        <span class="year">{item.Meeting.Date[2]}</span>
                                    </div>
                                </div>
                                <div class="info">
                                    <b>{item.Meeting.Department.Name}</b>
                                    <br>{item.Meeting.Date[4]}, {item.Meeting.Date[3]}<br>
                                    {#if item.hasOwnProperty('Agenda') }
                                        <b><a data-sveltekit-reload href="/meeting/?agenda={item.Meeting.ID}">Agenda</a></b>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-6">
            <div class="block">
                <div class="title">Past Meetings</div>
                <div class="content">
                    <div class="list council">
                        {#each councilPast as item (item.Meeting.ID) }
                            <div class="item level-1">
                                <div class="date">
                                    <div class="cal">
                                        <span class="month">{item.Meeting.Date[0]}</span>
                                        <span class="day">{item.Meeting.Date[1]}</span>
                                        <span class="year">{item.Meeting.Date[2]}</span>
                                    </div>
                                </div>
                                <div class="info">
                                    <b>{item.Meeting.Department.Name}</b>
                                    <br>{item.Meeting.Date[4]}, {item.Meeting.Date[3]}<br>
                                    {#if item.hasOwnProperty('Minutes') }
                                        <b><a data-sveltekit-reload href="/meeting/?minutes={item.Meeting.ID}">Minutes</a></b>
                                    {:else}
                                        <b><a data-sveltekit-reload href="/meeting/?agenda={item.Meeting.ID}">Agenda</a></b>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script>
import { get, setCookie, getCookie, deleteCookie } from "$lib/_helpers";
import { onMount } from 'svelte';
let councilUpcoming = [];
let councilPast = [];
onMount(() => {
    var startDate = new Date();
    startDate.setDate(startDate.getDate()-15);
    var sDateString = startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate();
    var endDate = new Date();
    endDate.setDate(endDate.getDate()+25);
    var eDateString = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate();
    get('https://br430b48d1.execute-api.us-east-1.amazonaws.com/prod/api/Meeting?range='+sDateString+'~'+eDateString+'&Group=AllMeetings', function(result3) 
    {
        var councilUpcomingTemp = [];
        var councilPastTemp = [];
        console.log(result3);
        for( var i=0; i<result3.length; i++ )
        {
            var item = result3[i];
            var date = Date.parse( item.Meeting.Date );
            item.Meeting.Date = [
                new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
                new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
                new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date),
                new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' }).format(date),
                new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
            ];

            if( date >= Date.now() ) {
                councilUpcomingTemp.push(item);
            }
            else
            {
                councilPastTemp.push(item);
            }
        }
        councilUpcoming = councilUpcomingTemp.reverse();
        councilPast = councilPastTemp;
    });
});
    
</script>