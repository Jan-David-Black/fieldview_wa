<?php phpinfo(); ?>
<?php
// required headers
error_reporting(E_ALL);
ini_set('display_errors', 'on');
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../config/utils.php';
include_once '../objects/SGroup.php';


// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$sgroup = new SGroup($db);
$sgroup->id = $_POST['id'];
$sgroup->types = $_POST['types'];

$sgroup->fetch_sensor_values($_POST['limit'] ?? 48,
                             $_POST['timelimit'] ?? 0);

if($sgroup->sensor_values){
    http_response_code(200);
    echo json_encode($sgroup->sensor_values);
}else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No Sensorvalues found for given SGroup")
    );
}
?>
