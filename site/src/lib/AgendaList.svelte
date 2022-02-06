<div class="container">
    <div class="row">
        <div class="col-12 text-center mb-4">
            <h3>Agendas & Minutes</h3>
        </div>
        <div class="col-12 col-lg-6">
            <div class="block">
                <div class="title">Upcoming Meetings</div>
                <div class="content">
                    <div class="list">
                        <div id="council-calendar-upcoming">{@html councilUpcoming}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-6">
            <div class="block">
                <div class="title">Past Meetings</div>
                <div class="content">
                    <div class="list">
                        <div id="council-calendar-past">{@html councilPast}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script>
import { get, setCookie, getCookie, deleteCookie } from "$lib/_helpers";
import { onMount } from 'svelte';
let councilUpcoming = '';
let councilPast = '';
onMount(() => {
    var startDate = new Date();
    startDate.setDate(startDate.getDate()-15);
    var sDateString = startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate();
    var endDate = new Date();
    endDate.setDate(endDate.getDate()+25);
    var eDateString = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate();
    get('https://br430b48d1.execute-api.us-east-1.amazonaws.com/prod/api/Meeting?range='+sDateString+'~'+eDateString+'&Group=AllMeetings', function(result3) 
    {
        
        for( var i=0; i<result3.length; i++ )
        {
            var html = '';
            var item = result3[i].Meeting;
            var date = Date.parse( item.Date );
            var dateArr = [
                new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
                new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
                new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date),
                new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' }).format(date),
                new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
            ];

            var dateDisplay = '<div class="date">\
                <div class="cal">\
                    <span class="month">'+dateArr[0]+'</span>\
                    <span class="day">'+dateArr[1]+'</span>\
                    <span class="year">'+dateArr[2]+'</span>\
                </div>\
            </div>';
            var text = '';
            if ( result3[i].hasOwnProperty('Minutes') )
            {
                text = '<a href="meeting/?minutes='+result3[i].Meeting.ID+'">Minutes</a>';
            }
            else if( result3[i].hasOwnProperty('Agenda') )
            {
                text = '<a href="meeting/?agenda='+result3[i].Meeting.ID+'">Agenda</a>';
            }
            html += '<div class="item level-1">'+dateDisplay+'<div><b>'+item.Department.Name+'</b><br>'+dateArr[4]+', '+dateArr[3]+'<br><b>'+text+'</div></div>';
            if( date >= Date.now() ) {
                councilUpcoming += html;
            }
            else
            {
                councilPast += html;
            }
        }
    });
});
    
</script>