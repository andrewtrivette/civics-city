import { error } from '@sveltejs/kit';
import { get } from "$lib/_helpers";
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    let domain = 'https://civics.city/atlanta/data';
    let aggregateYear = await fetch(domain+'/COBRA/year-aggregate.json');
    let aggregate2020 = await fetch(domain+'/COBRA/2020-aggregate.json');
    let aggregate2019 = await fetch(domain+'/COBRA/2019-aggregate.json')

    return {
        aggregate: {
            year: await aggregateYear.json(),
            '2020': await aggregate2020.json(),
            '2019': await aggregate2019.json()
        } 
    }
}