<!DOCTYPE html>
<html lang="en">
<head>
  <?php
  include_once '../../home.php';?>
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
    <button type="button" onClick="setTime(200)">Saison</button>
    <button type="button" onClick="setTime(30)">Month</button>
    <button type="button" onClick="setTime(7)">Week</button>
    <button type="button" onClick="setTime(1)">Day</button>
  </div>
  <script type="text/javascript">
  var SGroupID = "<?php echo $_GET['id'] ?>";
  var num_days = <?php echo $_GET['num_days'] ?? 7?>;
  </script>
  <script src="../../assets/js/detail.js?random=<?php echo filemtime('../../assets/js/detail.js'); ?>"></script>
</body>
</html>
