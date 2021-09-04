<?php
// required headers
error_reporting(E_ALL);
ini_set('display_errors', 'on');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/SGroup.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$sgroup = new SGroup($db);

// query products
$sgroup->id = $_POST["SGID"];
$stmt = $sgroup->set_position($_POST["position"]);   
http_response_code(200);
header("Location: /fieldview/qr.php");
die();

