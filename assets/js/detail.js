if('serviceWorker' in navigator) {
  navigator.serviceWorker.register(home+'sw.js')
    .then(registration => {
      console.log("Service Worker Registered");
    })
    .catch(e => console.log(e));
}

var user = "";
var pwd = "";
var myChart;

function rename(){
  window.location.href = home+"register/?imei="+SGroupID;
}

function compareResonseEntry(a,b){
  if (!('TYPE' in b[1])) return 0;
  if (!('TYPE' in a[1])) return 1;
  return b[1]['TYPE'].localeCompare(a[1]['TYPE'])
}

const label_map = {"temp1": "0cm", "temp2": "-5cm", "temp3" : "-20cm", "temp4": "-35cm"};
$(function(){
  console.log('Document is ready; Version', 1);
  console.log('SGroupID: ',SGroupID);
  $('#title').click(function(){rename(); return false; });
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  const dbPromise = idb.openDB('fieldview', ver_idb, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('login')) {
        console.log('making a new object store: login');
        db.createObjectStore('login', {autoIncrement:true});
      }
      if (!db.objectStoreNames.contains('temps')) {
        console.log('making a new object store: temps');
        db.createObjectStore('temps', {keyPath: "SGroupID", autoIncrement:false});
      }
    },
  });

  dbPromise.then(async function(db){
    var tx = db.transaction('login', 'readwrite');
    var store = tx.objectStore('login');
    await store.get(1).then(function(val){
      if(val){
        console.log('Retreived credentials');
        user  = val['user'];
        pwd   = val['pwd'];
      }else{
        console.log('no credentials redirecting to login');
        window.location.replace("/fieldview/login");
      }
    });
    console.log('fetching data for user: ', user)

    var tx_dat = db.transaction('temps', 'readwrite');
    var store = tx_dat.objectStore('temps');
    var last_cached_date = new Date('01 Jan 1970 00:00:00 GMT');
    var cache = {};
    await store.get(SGroupID).then(function(val){
      if(val){
        let tmp = val['labels'][val['labels'].length-1];
        if(tmp){
          cache = val;
          last_cached_date = tmp;
        }
      }
    });
    last_cached_date = new Date(last_cached_date.getTime()+1000*60);

    var form_data = new FormData();
    form_data.append( "user", user);
    form_data.append( "pwd", pwd);
    const opt_pram1 = {
      body: form_data,
      method: "POST"
    }
    fetch("../../api/sgroup/list.php", opt_pram1)
    .then(d=>{return d.json()})
    .then(res=>{
      res = res['SGroups'];
      $('#title').text(`Sensor ${SGroupID}: ${res[SGroupID]['Pos']}`);
    });

    form_data = new FormData();
    form_data.append( "user", user);
    form_data.append( "pwd", pwd);
    form_data.append( "id", SGroupID);
    form_data.append( "limit", 0);
    form_data.append( "startdate", moment(last_cached_date).format('YYYY-MM-DD HH:mm:ss'));
    console.log(last_cached_date);
    //form_data.append( "timelimit", 60*60*24*num_days); //7 Days
    form_data.append( "types[]", 'temp1');
    form_data.append( "types[]", 'temp2');
    form_data.append( "types[]", 'temp3');
    form_data.append( "types[]", 'temp4');
    const opt_pram2 = {
      body: form_data,
      method: "POST"
    }
    var summary = {};
    await fetch("../../api/sgroup/read.php", opt_pram2)
    .then(d=>{return d.json()})
    .then(res=>{
      console.log(res);
      var min_date = moment().subtract(7,'d');
      var ctx = $('#detail-chart');

      myChart = new Chart(ctx,{
          responsive: true,
          //bezierCurve: false,
          type: 'line',
          options:{
               responsive: true,
               maintainAspectRatio: false,
               scales: {
                   xAxes: [{
                         type: 'time',
                         display: true,
                         time: {
                              unit: 'day',
                              displayFormats: {
                                  hour: 'MMM D'
                              }
                         },
                         scaleLabel: {
                              display: true
                         },
                         ticks:{
                           min: min_date
                         }
                    }],
                    yAxes: [{
                         scaleLabel:{
                           labelString: 'Temp in °C',
                           display: true
                         }
                    }]
               },
               plugins: {
                 colorschemes: {
                   scheme: 'brewer.Paired12'
                 }
               }
          }
      });
      let first = 1;
      for (let [sid, val] of Object.entries(res).sort((a, b) => compareResonseEntry(a,b)).reverse()) {
        if(sid > 0){
	        var data = [];
          var labels = [];
          for (const [key, value] of Object.entries(val['VALUES'])) {
            data.push({t:moment(key).toDate(), y:value})
            if(first) labels.push(moment(key).toDate())
          }
          if(!(val['TYPE'] in cache)){
            cache[val['TYPE']] = [];
          }
          data = cache[val['TYPE']].concat(data);
          summary[val['TYPE']] = data;
          if(first){
            if(!('labels' in cache)){
              cache['labels'] = [];
            }
            labels = cache['labels'].concat(labels);
            summary["labels"] = labels;
            first = 0;
          } else {
            labels = summary["labels"];
          }
          var dataset = {
              label: label_map[val['TYPE']],
              data: data,
              labels: labels,
              fill: false,
              lineTension: 0.2,
              pointRadius: 0
          };
          //console.log(JSON.stringify(dataset));
          myChart.data.datasets.push(dataset);
          myChart.update();
        }
      }
    });
    var tx_dat = db.transaction('temps', 'readwrite');
    var store = tx_dat.objectStore('temps');
    summary['SGroupID']=SGroupID;
    store.put(summary);
  });
});

function setTime(num_days){
  //console.log(myChart);
  var time;
  if(num_days>60){
    time = {
         unit: 'month'
    };
  }else if (num_days>3) {
    time = {
         unit: 'day',
         displayFormats: {
             hour: 'MMM D'
         }
    };
  }else{
    time = {
         unit: 'hour',
         displayFormats: {
             hour: 'hA'
         }
    };
  }
  myChart.options.scales.xAxes[0].time = time;
  myChart.options.scales.xAxes[0].ticks.min = moment().subtract(num_days,'d');
  myChart.update();
}
