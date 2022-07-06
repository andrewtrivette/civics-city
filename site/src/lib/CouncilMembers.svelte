
{#each councilmembers as member (member.UserID) }
<div class="col-12 col-lg-4">
    <div class="block text-center">
        <div class="content px-3 py-4">
            <div class="circle">
                <img src="https://atlantacityga.iqm2.com/api/UserAccount/{member.UserID}/AvatarThumbnail" alt="{member.FullName} {member.title}" />
            </div>
            
            <div>
                <b>{member.FullName}</b>
            </div>
            <div>
                <em>{member.title}</em>
            </div>
            <div class="contact">
                {#if councilContacts[member.UserID] }
                    <p>
                        <a href="mailto:{councilContacts[member.UserID].email}">{councilContacts[member.UserID].email}</a>
                    </p>
                    <p>
                        <a href="tel:{councilContacts[member.UserID].phone}">{councilContacts[member.UserID].phone}</a>
                    </p>
                {/if}
            </div>
            <div class="cta">
                <a class="btn btn-primary btn-sm" href="/member/{member.UserID}">Profile & Voting History</a>
            </div>
        </div>
    </div>
</div>
{/each}


<style>
.circle {
    border-radius: 100%;
    overflow: hidden;
    width: 160px;
    height: 160px;
    margin: 10px auto 30px;
}
.circle img {
    width: 100%;
    height: auto;
}
</style>

<script>
import { get } from "$lib/_helpers";
import { onMount } from 'svelte';

let domain = 'https://civics.city/atlanta/data';
let councilmembers = [];
let councilContacts = {};


onMount(() => {
    get( domain+'/council-members.json', function(members) 
    {
        for( var i=0; i<members.length; i++ )
        {
            var member = members[i];

            member.title = member.Title.replace('Councilmember, ', '');
 
            councilmembers.push(member);
        }
        councilmembers = councilmembers;

        get( domain + '/council-contact.json', function(result4) 
        {
            councilContacts = result4;
        });

    });
});

</script>