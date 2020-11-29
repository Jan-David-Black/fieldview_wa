<?php
function valIfDef($var, $def){
  //returns $var if it is defined, else defaults to $def
  if(isset($var)){
    return $var;
  }else{
    return $def;
  }
}
?>
