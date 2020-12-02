if('serviceWorker' in navigator) {
  navigator.serviceWorker.register(home+'sw.js')
    .then(registration => {
      console.log("Service Worker Registered");
    })
    .catch(e => console.log(e));
}

var user = "";
var pwd = "";

$(function(){
  console.log('Document is ready; Version', 0);
  console.log('SGroupID: ',SGroupID);
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  const dbPromise = idb.openDB('fieldview', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('login')) {
        console.log('making a new object store: login');
        db.createObjectStore('login', {autoIncrement:true});
      }
    },
  });

  dbPromise.then(function(db){
    var tx = db.transaction('login', 'readwrite');
    var store = tx.objectStore('login');
    return store.get(1).then(function(val){
      if(val){
        console.log('Retreived credentials');
        user  = val['user'];
        pwd   = val['pwd'];
      }else{
        console.log('no credentials redirecting to login');
        window.location.replace("/fieldview/login");
      }
    });
  }).then(function(val){
    console.log('fetching data for user: ', user)
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
      $('#title').text(`Sensor ${SGroupID}: ${res[SGroupID]['Pos']} ${res[SGroupID]['Field']}`);
    });

    form_data = new FormData();
    form_data.append( "user", user);
    form_data.append( "pwd", pwd);
    form_data.append( "id", SGroupID);
    form_data.append( "limit", 0);
    form_data.append( "timelimit", 60*60*48); //2 Days
    form_data.append( "types[]", 'temp1');
    form_data.append( "types[]", 'temp2');
    form_data.append( "types[]", 'temp3');
    form_data.append( "types[]", 'temp4');
    const opt_pram2 = {
      body: form_data,
      method: "POST"
    }
    fetch("../../api/sgroup/read.php", opt_pram2)
    .then(d=>{return d.json()})
    .then(res=>{
      console.log(res);
      var ctx = $('#detail-chart');
      var myChart = new Chart(ctx,{
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
                              unit: 'hour',
                              displayFormats: {
                                  hour: 'MMM D hA'
                              }
                         },
                         scaleLabel: {
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
      for (let [sid, val] of Object.entries(res)) {
          var data = [];
          var labels = [];
          for (const [key, value] of Object.entries(val['VALUES'])) {
            data.push({t:moment(key).toDate(), y:value})
            labels.push(moment(key).toDate())
          }
          var dataset = {
              label: val['TYPE'],
              data: data,
              labels: labels,
              fill: false,
              lineTension: 0.2,
              pointRadius: 0
          };
          myChart.data.datasets.push(dataset);
          myChart.update();
      }
    });
  });
});
