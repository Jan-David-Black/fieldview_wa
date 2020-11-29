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

  $('#login').click(function(){
    window.location.href = home+"login";
  });

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
    return store.get(1);
  }).then(function(val){
    if(val){
      console.log('found credentials proceeding to login');
      window.location.replace("/fieldview/overview");
    }else{
      console.log('no credentials promoting login');
      $('#login').show();
    }
  });
  window.location.href = home+"login";
});
