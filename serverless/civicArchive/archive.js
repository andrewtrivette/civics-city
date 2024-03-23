var fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const FormData = require('form-data');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
function parseCookies(rawCookies) {

    return rawCookies.map((entry) => {
        const parts = entry.split(';');
        const cookiePart = parts[0];
        return cookiePart;
    }).join(';');
}
    
exports.handler = (event, context, callback) => {
    
        var response = await fetch('https://ody.dekalbcountyga.gov/portal/Home/Dashboard/26', {
            credentials: 'include',
            headers: {
                'User-Agent': 'test'
            }
        });
        var html = await response.text();
        var headers = await response.headers.raw();
        var cookies = parseCookies(headers['set-cookie']);
    
        const $ = cheerio.load(html);
        var officers = [];
        $('#selHSJudicialOfficer option').each(function(i, el) {
            if( $(this).val() != '' )
            {
                officers.push({
                    id: $(this).val(),
                    name: $(this).text()
                });
            }
        })
    
        console.log(officers);
        var d = new Date();
        var date_from = d.toLocaleDateString();
        d.setDate(d.getDate() + 30);
        var date_to = d.toLocaleDateString();
        var body = {
            "PortletName": "HearingSearch",
            "Settings.CaptchaEnabled": "False",
            "Settings.DefaultLocation": "All Courts",
            "SearchCriteria.SelectedCourt": "All Courts",
            "SearchCriteria.SelectedHearingType": "All Hearings",
            "SearchCriteria.SearchByType": "JudicialOfficer",
            "SearchCriteria.SelectedJudicialOfficer": null,
            "SearchCriteria.DateFrom": date_from,
            "SearchCriteria.DateTo": date_to,
        }
        // console.log(body);
        officers.forEach(
            async function(officer) {
    // console.log(officer);
            var body1 = Object.assign({}, body);
            body1['SearchCriteria.SelectedJudicialOfficer'] = officer.id;
            // console.log(body1);
            const params = new FormData();
            Object.entries(body1).forEach((item) => {
                params.append(item[0], item[1]);
            });
            // console.log(params);
    
            var response = await fetch('https://ody.dekalbcountyga.gov/portal/Hearing/SearchHearings/HearingSearch', {
                credentials: 'include',
                headers: {
                    'User-Agent': 'test',
                    'cookie': cookies
                },
                method: 'POST',
                body: params
            });
            // var text = await response.text();
            // console.log(text);
            const params1 = new FormData();
            Object.entries({
                'sort': '',
                'group': '',
                'filter': '',
                'portletId': '27'
            }).forEach((item) => {
                params1.append(item[0], item[1]);
            });
            // params1.setHeader('User-Agent', 'test');
            // console.log(params1)
            var response = await fetch('https://ody.dekalbcountyga.gov/portal/Hearing/HearingResults/Read', {
                credentials: 'include',
                headers: {
                    'User-Agent': 'test',
                    'cookie': cookies
                },
                method: 'POST',
                body: params1
            });
            var json = await response.text();
            // console.log(json);
            fs.writeFileSync('../data/test-judicial-'+officer.id+'.json', json);
            // json.then((json) => {
            //     console.log(json);
            // })
    
        }
        // test(officers[0]);
        )
    }
    init();