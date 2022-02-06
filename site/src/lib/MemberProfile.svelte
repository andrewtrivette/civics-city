<svelte:head>
    <title>Councilmember {repName} | Civics.City Atlanta</title>
</svelte:head>

<div class="container mt-4">
    <div class="row">
        <div class="col-12 col-lg-4">
            <div class="block text-center">
                <div class="content">
                    <div class="circle large">
                        <img id="repPhoto" src={repPhoto} alt={repName}>
                    </div> 
                    <h1 id="repName">Councilmember<br>{repName}</h1>
                    <br>
                    <div id="repEmail">{@html repEmail}</div>
                    <br>
                    <div id="repPhone">{@html repPhone}</div>
                    <br>
                    <div id="department">
                        {#each repDepartments as dept (dept.DepartmentID) }
                            <div class="mb-3">
                                <b>{dept.DepartmentName}</b><br><em>{dept.title} | {dept.attendance}</em>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-8">
            <div class="block mb-5">
                <div class="title">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 col-lg-6">
                            Recent Voting History 
                            </div>
                            <div class="col-12 col-lg-6">
                                <div class="btn-group">
                                    {#each Object.entries(types) as [type, value](type)}
                                        <button class="btn btn-sm {(activeVoteType == type) ? 'btn-primary' : 'btn-light'}" type="button" value="{type}" on:click={votingRecordsHandler}>{type}</button>
                                    {/each}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div class="content" id="voting">
                    {#if voteList.length > 0}
                            <div class="row d-none d-md-flex mb-4">
                                <div class="col-12 col-lg-8">
                                    <b>Title</b>
                                </div>
                                <div class="col-6 col-lg-2"><b>Vote</b></div>
                                <div class="col-6 col-lg-2"><b>Result</b></div>
                            </div>
                    {:else if activeVoteType }
                        <div class="d-flex justify-content-center">
                            <div><b>Retrieving voting history...</b></div><br>
                            <div class="spinner-border text-info" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    {/if}
                    {#each voteList as vote (vote)}
                        <div class="row pb-3 mb-3 border-bottom border-1 border-info">
                            <div class="col-12 col-lg-8">
                                <a class="text-white" href="http://atlantacityga.iqm2.com/Citizens/Detail_LegiFile.aspx?Frame=SplitView&MeetingID={vote.MeetingID}&ID={vote.ResolutionID}" target="_blank" rel="noopener">{vote.ResolutionShortTitle}</a>
                            </div>
                            <div class="col-6 col-lg-2">
                                <span class="d-md-none">Vote: </span>
                                {vote.UserVote}
                            </div>
                            <div class="col-6 col-lg-2">
                                <span class="d-md-none"><em>Result:</em> </span>{vote.VoteResultName.replace(/\//g, ' / ')}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
h1 {
    font-size: 1.7rem;
}
.circle {
    border-radius: 100%;
    overflow: hidden;
    width: 240px;
    height: 240px;
    margin: 20px auto 40px;
}
.circle img {
    width: 100%;
    height: auto;
}
#voting {
    font-size: 14pt;
}
</style>

<script>
export let id;
import { get } from "$lib/_helpers";
import { onMount } from 'svelte';

let domain = 'https://civics.city/atlanta/data';
let councilmembers = [];
let districtMember = null;

let repName = '';
let repPhoto = '';
let repEmail = '';
let repPhone = '';
let repDepartments = [];
let activeVoteType = null;
    let voteList = [];

var types = {
    Ordinance: { 
        icon: 'gavel',
        class: 'purple lighten-1 white-text'
    },
    Resolution: { 
        icon: 'campaign',
        class: 'light-green black-text'
    },
    Communication: { 
        icon: 'contact_mail',
        class: 'purple accent-1 black-text'
    }
};
var votes = {
    'Yes/Aye': {
        icon: 'check_circle',
        class: 'text-darken-4 light-green-text'
    },
    'No': {
        icon: 'block',
        class: 'text-darken-4 red-text'
    },
    'Absent': {
        icon: 'snooze',
        class: 'text-darken-4 red-text'
    }
};

onMount(() => {
    get( domain+'/council-members.json', function(members) 
    {
        for( var i=0; i<members.length; i++ )
        {
            var member = members[i];

            member.title = member.Title.replace('Councilmember, ', '');
            if( id == member.UserID )
            {
                districtMember = member;
            }
        }


        get('https://br430b48d1.execute-api.us-east-1.amazonaws.com/prod/api/BoardMember/'+districtMember.UserID, function(result2) 
        {
            repName = result2.User.FullName;
            repPhoto = 'https://atlantacityga.iqm2.com/api/UserAccount/'+districtMember.UserID+'/Avatar';
            
            get( domain + '/council-contact.json', function(result4) 
            {
                var contact = result4[districtMember.UserID];
                repEmail = '<a href="mailto:'+contact.email+'">'+contact.email+'</a>';
                repPhone = '<a href="tel:'+contact.phone+'">'+contact.phone+'</a>';

                // councilContacts = result4;
            });

            for( var i=0; i<result2.Departments.length; i++ )
            {
                var dept = result2.Departments[i];
                dept.title = ( dept.UserTitle.indexOf( districtMember.title) != -1 ) ? 'Member': dept.UserTitle;
                dept.attendance = Math.round(dept.Attendance)+'% Attendance';
                if( dept.DepartmentName.indexOf(districtMember.title) == -1 )
                {
                    repDepartments.push(dept);
                }
            }
            repDepartments = repDepartments;
        });
        votingRecordsHandler({ target: { value: 'Ordinance'}});
    });
    

    
});
function votingRecordsHandler(e) {
        // e.preventDefault();
        var val = e.target.value;
        activeVoteType = val;

        get('https://br430b48d1.execute-api.us-east-1.amazonaws.com/prod/api/BoardMember/'+districtMember.UserID+'/VoteHistory', function(result3) {
            var tempList = [];
            var length = Math.min(150, result3.Votes.length);
            for(var i=0; i<length;i++)
            {
                var item = result3.Votes[i];
                var type = item.DocumentTypeName;
                if( type == val )
                {
                    tempList.push(item);
                }
            }
            voteList = tempList;
        });   
    }

</script>