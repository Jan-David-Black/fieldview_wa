<?php
class SGroup{

    // database connection and table name
    private $conn;
    private $table_name = "products";

    // object properties
    public $id;
    public $pos;
    public $field;
    public $sensor_values;
    public $types;

    public function __construct($db){
      $this->conn = $db;
    }

    function fetch_sensor_values($limit, $time_limit){
      $sql = "SELECT SensorID, Type, pos FROM Sensors LEFT JOIN Correction_Sensorposition USING (SensorID) WHERE SGroup = ?";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("s", $this->id);
      $stmt->execute();
      $stmt->store_result();
      $stmt->bind_result($SID, $Type, $pos);
      $Types = [];
	  $Pos = [];
      while ($stmt->fetch()) {
        $Types[$SID] = $Type;
		$Pos[$SID] = $pos;
      }
      $stmt->close();
		
	  var_dump($Pos);
      $Result = [];
      foreach ($Types as $SID => $Type) {
        if(!isset($this->types) or in_array($Type, $this->types)){
          $sql = "SELECT Timestamp, Value FROM Sensor_Values WHERE SensorID = ? ";
          if($time_limit){
            $sql = $sql."and Timestamp >= DATE_SUB(NOW(),INTERVAL ".$time_limit." SECOND)";
          }
          if($limit){
            $sql = $sql."ORDER BY id DESC LIMIT ".$limit;
          }
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param("s", $SID);
          $stmt->execute();
          $stmt->store_result();
          $stmt->bind_result($time, $val);
          $tmp_arr = ["TYPE" => $Type, "VALUES" => []];
          while ($stmt->fetch()) {
            $tmp_arr["VALUES"][$time] = $val;
          }
          $stmt->close();
          $Result[$SID] = $tmp_arr;
        }
      }

      $this->sensor_values = $Result;
    }

    function list(){
      // select all query
      $sql = "SELECT * FROM SGroups";

      $stmt = $this->conn->prepare($sql);
      $stmt->execute();
      $stmt->store_result();
      return $stmt;
    }
}
?>
