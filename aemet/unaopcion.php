<?php
ob_start(); 
include_once('aemet_functions.php');

$url = $_GET["urlQuery"];
$opcion = $_GET["opcion"];

if(strlen($opcion)<3)
$url = "https://opendata.aemet.es/opendata".$url;
else
$url = "https://opendata.aemet.es/opendata".$url.$opcion;

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



?>/api/antartida/datos/fechaini/1970-01-01/fechafin/2022-12-12/estacion/89064