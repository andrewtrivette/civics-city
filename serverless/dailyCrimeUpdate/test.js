const { https } = require('follow-redirects');

const promiseWhile = (data, condition, action) => {
  var whilst = (data) => {
  	// console.log(data);
    return condition(data) ?
      action(data).then(whilst) :
      Promise.resolve(data);
  }
  return whilst(data);
};


var data = [];
const get = (num) => {
  return new Promise((resolve, reject) => {
    var yesterday = new Date(Date.now() - 86400000);
    var yesterDate = yesterday.toISOString().split('T')[0];
    var yesterDate = '2023-03-01';
    var monthStart = yesterday.getFullYear()+'-'+(yesterday.getMonth()+1+'').padStart(2, '0')+'-01';
    monthStart = '2023-02-01'
    console.log({yesterDate, monthStart})
    https.get(`https://services3.arcgis.com/Et5Qfajgiyosiw4d/arcgis/rest/services/CrimeDataExport_2_view/FeatureServer/1/query?f=json&where=((report_Date >= timestamp '${monthStart}') AND (report_Date < timestamp '${yesterDate }'))&outFields=*&resultOffset=${num}`, (res) => {
      
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        
        var json = JSON.parse(rawData);
        num = (json.exceededTransferLimit) ? num+2000 : false;
        data = [...data, json.features]
        resolve(num);
      });
    });
  })
}
promiseWhile(0, num => Number.isInteger(num), get).then(num => {
  console.log('data', data.flat().length); 
});

