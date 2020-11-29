<?php
error_reporting(E_ALL);
ini_set('display_errors', 'on');
include_once '../home.php';
$top_dir = $_SERVER['DOCUMENT_ROOT'].$home;
include_once $top_dir.'api/config/database.php';
if(isset($_GET['logout'])){
  //json_encode($_POST);
?>
<link rel="icon" href="../favicon.ico" type="image/x-icon" />
<script src="<?= $home ?>assets/js/node_modules/jquery/dist/jquery.min.js"></script>
<script src="<?= $home ?>assets/js/node_modules/idb/build/iife/index-min.js"></script>
<script type="text/javascript"> let home = <?= $home ?>;</script>
<script src="<?= $home ?>assets/js/logout.js"></script>
<?php //end logout
}elseif(isset($_POST['user']) or isset($_POST['pwd'])){
  if(!isset($_POST['user']) or $_POST['user']==""){
    http_response_code(200);
    echo json_encode(['success' => false, 'error' => 'no user specified']);
  }elseif(!isset($_POST['pwd']) or $_POST['pwd']==""){
    http_response_code(200);
    echo json_encode(['success' => false, 'error' => 'no password specified']);
  }else{ //try credentials with mysqli
    $database = new Database();
    $db = $database->getConnection();
    //var_dump($db);
    if($db->connect_errno){
      http_response_code(200);
      echo json_encode(['success' => false, 'error' => 'credentials wrong']);
    }else{
      http_response_code(200);
      echo json_encode(['success' => true]);
    }
  }
}else{ ?>
<html lang="en">
<head>
  <?php include $top_dir.'assets/html/head.php'; ?>
  <!--<?php include $top_dir.'assets/html/charts.php'; ?>-->
</head>

<body class="fullscreen">
  <div class="container" id="login">
    <!--<h1 class="title">Aspargis</h1>-->
    <img class='logo' src="<?= $home ?>assets/images/Logo_rwdraw.svg"></img>
    <form id="login-form" method="post">
     <input type="text" id="user" name="user" placeholder="username"><br>
     <input type="password" id="pwd" name="pwd" placeholder="password">
     <button type="submit" value="Submit">login</button>
    </form>
    <div id="prompt"></div>
  </div>
  <div class="container" id="logout" style="display: none">
    You are already signed in please sign out first...
    <br>
    <br>
    <button onclick="location.href='?logout'">logout</button>
  </div>
  <script src="<?= $home ?>assets/js/login.js"></script>
</body>
</html>
<?php } ?>
