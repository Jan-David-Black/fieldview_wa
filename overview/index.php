<html lang="en">
<head>
  <?php
  include_once '../home.php';
  $top_dir = $_SERVER['DOCUMENT_ROOT'].$home;?>
  <?php include $top_dir.'assets/html/head.php'; ?>
  <!--<?php include $top_dir.'assets/html/charts.php'; ?>-->
</head>

<body class="fullscreen">
  <img class='logo' src="<?= $home ?>assets/images/Logo_rwdraw.svg"></img>
  <button onclick="location.href='<?= $home ?>login?logout'" class="navigation">logout</button>

  <div class="container" id="short">
  </div>

  <script src="../assets/js/overview.js"></script>
</body>
</html>
