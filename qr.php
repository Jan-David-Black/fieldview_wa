<html lang="en">
<head>
  <?php
  error_reporting(E_ALL);
  ini_set('display_errors', 'on');
  include_once 'home.php';?>
  <?php include $top_dir.'assets/html/head.php'; ?>
  <!--<?php include $top_dir.'assets/html/charts.php'; ?>-->
  <script src="<?= $home ?>assets/js/node_modules/qr-scanner/qr-scanner.umd.min.js"></script>
</head>

<body class="fullscreen">
<img class='logo' src="<?= $home ?>assets/images/Logo_rwdraw.svg"></img>
  <div class="container">
	<button onclick="location.href='<?= $home ?>overview'" class="navigation">Overview</button>
	<p></p>
	<div class="container" id="short">
	  <video id="qr-video"></video>
	  <div></div>
	</div>
  </div>
  <script> qr_worker_path = "<?= $home ?>assets/js/node_modules/qr-scanner/qr-scanner-worker.min.js"</script>
  <script src="assets/js/qr.js"></script>
</body>
</html>
