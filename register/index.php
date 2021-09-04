<html lang="en">
<head>
  <?php
  error_reporting(E_ALL);
  ini_set('display_errors', 'on');
  include_once '../home.php';?>
  <?php include $top_dir.'assets/html/head.php'; ?>
  <!--<?php include $top_dir.'assets/html/charts.php'; ?>-->
</head>

<body class="fullscreen">
  <img class='logo' src="<?= $home ?>assets/images/Logo_rwdraw.svg"></img>
  <h1>Rename Sensor: <?php $_GET["imei"]?></h1>
  <button onclick="location.href='<?= $home ?>overview'" class="navigation">Overview</button>

  <div class="container" id="short">
	<form id="rename-form" action="<?= $home ?>api/sgroup/rename.php" method="post">
	  <label class="input-label" for="position">Position</label>
	  <input type="text" id="position" name="position"><br>
	  <label class="input-label" for="SGID">ID</label>
	  <input type="text" id="SGID" name="SGID" value="<?php echo substr($_GET["imei"], -6);?>" readonly><br>
	  <input type="submit" value="submit">
	  <input id="user" name="user" type="hidden">
	  <input id="pwd" name="pwd" type="hidden">
	</form>
  </div>
  <button onclick="location.href='<?= $home ?>qr.php'" class="navigation2">scan another</button>


  <script src="../assets/js/register.js?random=13"></script>
</body>
</html>
