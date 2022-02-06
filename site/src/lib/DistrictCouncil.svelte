<div class="col-12 col-lg-5">
    <div class="block">
        <div class="title">Councilmembers</div>
        <div class="content">
            <div id="atLarge">
                {#each councilmembers as member (member.UserID) }
                    <div class="councilmember row mb-4 justify-content-center">
                        <div class="col-12 col-lg-4 text-center">
                            <div class="circle">
                                <img src="https://atlantacityga.iqm2.com/api/UserAccount/{member.UserID}/AvatarThumbnail" alt="{member.FullName} {member.title}" />
                            </div>
                            <div class="cta">
                                <a class="btn btn-primary btn-sm" href="/member/{member.UserID}">Profile & Voting History</a>
                            </div>
                        </div>
                        
                        <div class="col-12 col-lg-8 text-center text-lg-start">
                            <div>
                                <b>{member.FullName}</b>
                            </div>
                            <div>
                                <em>{member.title}</em>
                            </div>
                            <div class="contact">
                                {#if councilContacts[member.UserID] }
                                    <div>
                                        <a href="mailto:{councilContacts[member.UserID].email}">{councilContacts[member.UserID].email}</a>
                                    </div>
                                    <div>
                                        <a href="tel:{councilContacts[member.UserID].phone}">{councilContacts[member.UserID].phone}</a>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
.councilmember {
    display: flex;
    justify-content: flex-start;
    line-height: 2.2;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 30px;
}
.circle {
    border-radius: 100%;
    overflow: hidden;
    width: 100px;
    height: 100px;
    display: inline-block;
    margin: 10px auto 20px auto;
}
.circle img {
    width: 100%;
    height: auto;
}
</style>

<script>
export let id;
import { get } from "$lib/_helpers";
import { onMount } from 'svelte';

let domain = 'https://civics.city/atlanta/data';
let councilmembers = [];
let councilContacts = {};
let districtMember = null;

let repName = '';
let repPhoto = '';
let repEmail = '';
let repPhone = '';
let repDepartments = [];


onMount(() => {
    get( domain+'/council-members.json', function(members) 
    {
        for( var i=0; i<members.length; i++ )
        {
            var member = members[i];

            member.title = member.Title.replace('Councilmember, ', '');
            if( member.title.indexOf('At Large') != -1 )
            {
                councilmembers.push(member);
            }
            if( 'District '+id == member.title )
            {
                districtMember = member;
            }
        }
        councilmembers.unshift(districtMember);
        console.log(councilmembers);

            
            get( domain + '/council-contact.json', function(result4) 
            {
                var contact = result4[districtMember.UserID];
                repEmail = '<a href="mailto:'+contact.email+'">'+contact.email+'</a>';
                repPhone = '<a href="tel:'+contact.phone+'">'+contact.phone+'</a>';

                councilContacts = result4;
            });



    });
});

let activeVoteType = null;
let voteList = [];

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