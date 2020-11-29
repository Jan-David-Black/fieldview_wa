if('serviceWorker' in navigator) {
  navigator.serviceWorker.register(home+'sw.js')
    .then(registration => {
      console.log("Service Worker Registered");
    })
    .catch(e => console.log(e));
}

$(function(){
  console.log('Document is ready; Version', 0);
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  const dbPromise = idb.openDB('fieldview', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('login')) {
        console.log('making a new object store');
        db.createObjectStore('login', {autoIncrement:true});
      }
    },
  });
  dbPromise.then(function(db){
    var tx = db.transaction('login', 'readwrite');
    var store = tx.objectStore('login');
    store.get(1).then(function(val){
      if(val){
        console.log("already logged in... Prompting to logout")
        $('#login').hide();
        $('#logout').show();
      }
    });
  });

  $('#login-form').submit(function(event){
      event.preventDefault();
      const opt_pram = {
        body: new FormData(event.target),
        method: "POST"
      }
      fetch("index.php", opt_pram)
      .then(d=>{return d.json()})
      .then(res=>{
        //console.log(res);
        if(res['success']){
          console.log('credentials correct saving to idb')
          dbPromise.then(function(db){
            var tx = db.transaction('login', 'readwrite');
            var store = tx.objectStore('login');
            store.get(1).then(function(val){
              if(val){
                console.log('already logged in');
                $('#prompt').html('already logged in... please <a href="?logout">logout</a> first');
                return false;
              }else{
                var arr = $('#login-form').serializeArray();
                var item = {
                  user: arr[0]['value'],
                  pwd: arr[1]['value']
                };
                store.add(item, 1);
                window.location.replace("/fieldview/overview");
              }
            });
          });
        }else{
          console.log('login unsuccessfull')
          $('#prompt').html(res['error'])
        }
      })
      .catch(err=>{console.log(err)})
  });
});
