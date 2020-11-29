<?php
class Database{
    private $host = "40.118.64.248";
    private $db_name  = "";
    private $username = "";
    private $password = "";
    public $verbose = false;
    public $conn;

    function __construct(){
      //echo json_encode($_POST);
      $this->db_name = $_POST["user"];
      $this->username = $_POST["user"];
      $this->password = $_POST["pwd"];
    }
    // get the database connection
    public function getConnection(){

        $this->conn = null;

        try{
            $this->conn = new mysqli($this->host, $this->db_name, $this->password, $this->username);
        }catch(Exception $exception){
            if($this->vebose){
              echo "Connection error: " . $exception->getMessage();
            }
        }

        return $this->conn;
    }
}
?>
