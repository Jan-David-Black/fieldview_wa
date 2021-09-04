if('serviceWorker' in navigator) {
  navigator.serviceWorker.register(home+'sw.js')
    .then(registration => {
      console.log("Service Worker Registered");
    })
    .catch(e => console.log(e));
}

function register(imei){
	window.location.href = home+"register/?imei="+imei;
	qrScanner.destroy();
}
var qrScanner;
$(function(){
  console.log('Document is ready; Version', 0);
  QrScanner.WORKER_PATH = qr_worker_path;
  let videoElem = document.getElementById('qr-video');
  console.log(videoElem);
  qrScanner = new QrScanner(videoElem, result => register(result));
  $(videoElem).hide();
  
  videoElem.parentNode.insertBefore(qrScanner.$canvas, videoElem.nextSibling);
  qrScanner.$canvas.style.display = 'block';
  qrScanner.$canvas.style.width ='100%';
  qrScanner.start();
  //qrScanner.destroy();
  //qrScanner = null;
});