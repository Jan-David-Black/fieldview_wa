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
$stmt = $sgroup->list();
$num = $stmt->num_rows;
// check if more than 0 record found
if($num>0){
    // products array
    $sgroups_arr=array();
    $sgroups_arr["SGroups"]=array();
    $stmt->bind_result($SGID, $Pos, $Field);
    while ($stmt->fetch()){
        $sgroup_item = [
          "Pos"    => $Pos,
          "Field"  => $Field
        ];

        $sgroups_arr["SGroups"][$SGID] = $sgroup_item;
    }
    //var_dump($sgroups_arr);
    // set response code - 200 OK
    http_response_code(200);

    // show products data in json format
    echo json_encode($sgroups_arr);
}else{

    // set response code - 404 Not found
    http_response_code(404);

    // tell the user no products found
    echo json_encode(
        array("message" => "No Sensor Groups found")
    );
}
