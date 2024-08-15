<html>
<head>
<title>Pruebas AEMET</title>
</head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv=”Content-Type” content=”text/html; charset=UTF-8″ />
<style>
	iframe{width:100%;heigth:1000;}
</style>
<body>
<?php
include_once('aemet_functions.php');
$url = $_GET["urlQuery"];
if(strpos($url, "/api")==0)
	$url = "https://opendata.aemet.es/opendata".$url;

$data = getAemetData($url);

$resp = httpRequest($url);

echo utf8_encode($resp);

//echo mb_convert_encoding( httpRequest("https://opendata.aemet.es/opendata/sh/dfd88b22"), "UTF-8","ISO-8859-1");

//echo httpRequest("https://opendata.aemet.es/opendata/sh/dfd88b22");

//printArray(httpRequest($url));

//parseAemetResp(httpRequest($url));

$aux = json_decode(utf8_encode($resp), true);

echo "</br><a href='",$aux["datos"],"' target='_blank' class='LZ-bar-item LZ-button'>Datos recibidos</a></br>";

echo httpRequest($aux["datos"]);
echo "</br></br>";
echo mb_convert_encoding( httpRequest($aux["datos"]), "UTF-8","ISO-8859-1");
echo "</br><iframe src='",$aux["datos"],"'</iframe></br>";

//file_get_contents($aux["datos"]);


?>
</body>
</html>