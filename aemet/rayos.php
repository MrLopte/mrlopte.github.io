<?php
ob_start(); 
include_once('aemet_functions.php');

$url = "https://opendata.aemet.es/opendata/api/red/rayos/mapa";

//$data = getAemetData($url);

$resp = httpRequest($url);


$aux = json_decode(utf8_encode($resp), true);

$goto=$aux["datos"];


while (ob_get_status()) 
{
    ob_end_clean();
}


// no redirect
header( "Location: $goto" );



?>