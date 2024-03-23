const cheerio = require('cheerio');

function parseContent(html) {
    var text = html.replace(/ style="(.*?)"/g, '')?.replace(/&nbsp;/g, '')?.replace(/\n/g, '')?.replace(/\t/g, '')?.replace(/\s\s/g, ' ')?.replace(/<span>(.*?)<\/span>/g, '$1');
    return text;
}

module.exports = function (html) {
    const $ = cheerio.load(html);
    var header = $('.LegiFileHeader');
    var fileType = header.find('#ContentPlaceHolder1_lblLegiFileType').text();
    var resNum = header.find('#ContentPlaceHolder1_lblResNum').text();
    var status = header.find('#ContentPlaceHolder1_lblStatus').text();
    var date = header.find('#LegiFileStatusDate').text();
    var title = $('.LegiFileTitle .LegiFileHeading').text();
    var info = parseContent($('.LegiFileInfo .LegiFileSectionContents').html());
    var attachments = $('.LegiFileSection:not(#divBody):not(.MeetingHistory) li').map(function(i, el) {
        return {
            link: $(this).find('a').attr('href'),
            label: $(this).find('a').text()
        }
    }).toArray();
    var body = $('.LegiFileSection#divBody .LegiFileSectionContents p');
    var bodyArr = body.map(function(i, el) { return parseContent($.html(this)); }).toArray();
    var historyList = [];
    $('.LayoutTable.MeetingHistory>tbody>tr').each(function(i, el) {
        var key = ( i % 2 == 0 ) ? i+1 : i;
        if( historyList[key] == undefined )
        {
            historyList[key] = {}
        }
        if( $(el).hasClass('HeaderRow') ) 
        {
            $(el).find('.Date a').each(function(i, el) {
                if( i == 0 )
                {
                    historyList[key].date = $(el).text();
                    historyList[key].meetingLink = $(el).attr('href');
                }
                else
                {
                    historyList[key].videoLink = $(el).attr('onclick').replace(/javascript\:OpenWindow\("(.*?)"\);/, '$1');
                }
            })
            historyList[key].committee = $(el).find('.Group').text();
        } 
        else 
        {
            historyList[key].VoteResult = $.html(el).replace(/\n/g, '').trim();
        }
        
    });
    function parseTitle( text ) {
        var temp = text.split(' ');
        var words = temp.map( (word) => {
            word = word.trim();
            return word[0].toUpperCase() + word.substring(1).toLowerCase();
        })
        return words.join(' ');
    }
    return {
        fileType,
        resNum,
        status,
        date,
        title: parseTitle( title.trim() ),
        info,
        attachments,
        body: bodyArr,
        history: historyList.filter( x => x)
    };
}