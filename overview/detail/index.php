<html lang="en">
<head>
  <?php
  include_once '../../home.php';
  $top_dir = $_SERVER['DOCUMENT_ROOT'].$home;?>
  <?php include $top_dir.'assets/html/head.php'; ?>
  <?php include $top_dir.'assets/html/charts.php'; ?>
</head>

<body class="fullscreen">
  <h1>Fieldview</h1>
  <button onclick="location.href='../'" class="navigation">back</button>
  <h2 id="title"></h2>
  <div class="container">
    <div class="chart-container">
      <canvas id="detail-chart" ></canvas>
    </div>
  </div>
  <script type="text/javascript">
  var SGroupID = "<?php echo $_GET['id'] ?>";
  </script>
  <script src="../../assets/js/detail.js"></script>
</body>
</html>
