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
        window.location.replace(home+"login");
      }
    });
  }).then(function(val){
    console.log('fetching data for user: ', user)

    var form_data = new FormData();
    form_data.append( "user", user);
    form_data.append( "pwd", pwd);
    const opt_pram = {
      body: form_data,
      method: "POST"
    }
    fetch("../api/sgroup/list.php", opt_pram)
    .then(d=>{return d.json()})
    .then(res=>{
	  console.log(res);
      //$('#SGroups').text(JSON.stringify(res, null,2));
	  var p = Promise.resolve();
      for (let [key, value] of Object.entries(res['SGroups'])) {
        let div = jQuery('<div/>', {
            id: 'sgroup-${key}',
            "class": 'shortinfo'
        });
        let a = jQuery('<a/>', {
            href: `detail?id=${key}`,
        });
        $('#short').append(a);

        div.addClass('SGroup_ov').append(`<a href="detail?id=${key}"></a>`);
        //<h3>Sensor ${key}: ${value["Pos"]} ${value["Field"]}</h3>
        let ul = jQuery('<ul/>', {});

        var form_data = new FormData();
        form_data.append( "user", user);
        form_data.append( "pwd", pwd);
        form_data.append( "id", key);
        form_data.append( "limit", 1);
        form_data.append( "types[]", 'temp1');
        form_data.append( "types[]", 'temp2');
        form_data.append( "types[]", 'temp3');
        form_data.append( "types[]", 'temp4');
        const opt_pram = {
          body: form_data,
          method: "POST"
        }
		
        p = p.then(_ => {fetch("../api/sgroup/read.php", opt_pram)
			.then(d=>{return d.text()})
			.then(data=>{
			  console.log(data);
			  const res = JSON.parse(data);
			  var props = [];
			  for (let [sid, val] of Object.entries(res)) {
				let key = Object.keys(val['VALUES'])[0];
				props[val['TYPE']] = parseFloat(val['VALUES'][key]).toFixed(2);
				props['time'] = key;
				ul.append(`<li>${key}: ${val['TYPE']} = ${val['VALUES'][key]}</li>`)
			  }
			  return props;
			}).then(props=>{
			  //div.append(ul);
			  fetch(home+'assets/images/damm.svg')
			  .then(response => response.text())
			  .then((data) => {
				for (let [key, val] of Object.entries(props)) {
				  data = data.replace("${val['"+key+"']}", val)
				}
				let div_graphic = jQuery('<div/>', {});
				div_graphic.html(data);
				div.append(div_graphic);
				a.append(div);
			  });
			});
		});
      }
    });
  });
});
