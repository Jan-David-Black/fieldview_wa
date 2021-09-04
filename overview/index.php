<!DOCTYPE html>
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
  <h1><img class='logo' src="<?= $home ?>assets/images/Logo_rwdraw.svg" alt="Aspargis Logo"></img></h1>

  <button onclick="location.href='<?= $home ?>qr.php'" class="navigation">rename</button>

  <div class="container" id="short">
  </div>
  <button onclick="location.href='<?= $home ?>login?logout'" class="navigation2" id="logout-button" style="display: none">logout</button>

  <script src="../assets/js/overview.js?random=13"></script>
</body>
</html>
