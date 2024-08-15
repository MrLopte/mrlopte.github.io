<?php

 

define("api_key", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsdWlzZXRlNzc3QGdtYWlsLmNvbSIsImp0aSI6ImE0Yjg1NzE5LTQyNmYtNDc1Yy04MGE3LTQ0OGE3ZDdjOWNjZSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTIzODYxNTkyLCJ1c2VySWQiOiJhNGI4NTcxOS00MjZmLTQ3NWMtODBhNy00NDhhN2Q3YzljY2UiLCJyb2xlIjoiIn0.OpPOml5MjQINu-lSoFBTQiZ2dU2UU5tPtlcNAZ0SONs");



function conexionDB(){

	$servername = "localhost";

	$username = "id17861115_admin";

	$password = "p82Vh3R^U?qJ)hMi";

	$database = "id17861115_database";

	// Create connection

	$conn = new mysqli($servername, $username, $password, $database);

	// Check connection

	if ($conn->connect_error) {

		die("Connection failed: " . $conn->connect_error);

	}

	return $conn;

}



function storeJsonHorariaOdiaria($url,$json){

		if(stripos($url, "/horaria")===true){

			storeJson($json, "-");

	    }

	    if(stripos($url, "/diaria")===true){

			storeJson("-",$json);

	    }

	    return;

    }

	 

function printArray($arr){

	echo "<pre>";print_r($arr);echo"</pre><br>";

}

function printString($str, $choice){
	if($choice){
		echo "$str";
	}
}


function httpRequest($url){



$curl = curl_init(); 

	curl_setopt_array($curl, array(

		CURLOPT_URL => $url."?api_key=".api_key, 

		CURLOPT_RETURNTRANSFER => true, CURLOPT_ENCODING => "", 

		CURLOPT_MAXREDIRS => 10, 

		CURLOPT_TIMEOUT => 30, 

		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1, 

		CURLOPT_CUSTOMREQUEST => "GET", 

		CURLOPT_HTTPHEADER => array( "cache-control: no-cache",)

     )); 

	$data = curl_exec($curl); 

	$err = curl_error($curl); 

	curl_close($curl); 



	if ($err) { 

		echo "cURL Error1 #:" . $err; 

    return $err;

	} 

	else { 

   return mb_convert_encoding($data, "UTF-8","ISO-8859-1");

		//return $data;

	}

}



function parseAemetResp($resp){



$aux = json_decode(utf8_encode($resp), true);

//$aux = json_decode($resp, true);

		  if (!array_key_exists('datos', $aux)) {

		    return $resp;

		}

    return httpRequest($aux['datos']);

}



function getAemetData($url){

    

    $curl = curl_init(); 

	curl_setopt_array($curl, array(

		CURLOPT_URL => $url."?api_key=".api_key, 

		CURLOPT_RETURNTRANSFER => true, CURLOPT_ENCODING => "", 

		CURLOPT_MAXREDIRS => 10, 

		CURLOPT_TIMEOUT => 30, 

		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1, 

		CURLOPT_CUSTOMREQUEST => "GET", 

		CURLOPT_HTTPHEADER => array( "cache-control: no-cache" ), )); 

	$response1 = curl_exec($curl); 

	$err1 = curl_error($curl); 

	curl_close($curl); 

	

	if ($err1) { 

      echo "cURL Error1 #:" . $err1; 

      return $err;

    } 

	else { 

		$aux = json_decode(utf8_encode($response1), true);

		if (!array_key_exists('datos', $aux)) {

		    return $aux;

		}

		printArray($aux);

		$curl = curl_init(); 

			curl_setopt_array($curl, array(

				CURLOPT_URL => $aux["datos"]."?api_key=".api_key, 

				CURLOPT_RETURNTRANSFER => true, CURLOPT_ENCODING => "", 

				CURLOPT_MAXREDIRS => 10, 

				CURLOPT_TIMEOUT => 30, 

				CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,

				CURLOPT_CUSTOMREQUEST => "GET", 

				CURLOPT_HTTPHEADER => array( "cache-control: no-cache" ), )); 

		$response = curl_exec($curl); 

		$err = curl_error($curl); 

		curl_close($curl); 

		if ($err) { echo "cURL Error2 #:" . $err; return $err;} 

		else { 

       $response = mb_convert_encoding( $response, "UTF-8","ISO-8859-1");

			$arr = json_decode(utf8_encode($response), true);

		}

		storeJsonHorariaOdiaria($url,$arr);

		return $arr;

	}

	

	function storeJson($jsonH, $jsonD){

		$conn = conexionDB();

		$conn->query(" create table if not exists jsonTest(_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT, jsonH VARCHAR(20000), jsonD VARCHAR(20000), fecha VARCHAR(50));");



		$jsonHoras= mysqli_real_escape_string($conn,$jsonH);

		$jsonDias= mysqli_real_escape_string($conn,$jsonD);

		

		$date = mysqli_real_escape_string($conn, date("D M j G:i:s T Y"));  



		$conn->query("insert into visitors(jsonH, jsonD, fecha) values('$jsonHoras', '$jsonDias', '$date');");

		return;

	}

	

	function tiempoExec($t0){

		$t_exec =  microtime($g=true);

		return $t_exec-$t0;

	}

	function deleteMunicipiosDB(){

	$conn = conexionDB();

    $conn->query("delete * from  municipios;");

    return;

}

    function storeMunicipiosDB($data){

	    $conn = conexionDB();

	    $conn->query(" create table if not exists municipios(_id INTEGER(10) PRIMARY KEY, latitud VARCHAR(20), id_old INTEGER(15), url VARCHAR(20), latitud_dec FLOAT(20), altitud INTEGER(15), capital VARCHAR(30), num_hab INTEGER(20), zona_comarcal INTEGER(20), destacada INTEGER(5), nombre VARCHAR(30), longitud_dec FLOAT(20), id VARCHAR(20), longitud VARCHAR(20));");

        printArray($conn);

		foreach($data as $k => $d){
	        $values = array_values($d);

            foreach($values as $ke => $v){
                $values[$ke] = mysqli_real_escape_string($conn,$v);
            }

            if(count($values)==13){

                $query = "insert into municipios (latitud, id_old, url, latitud_dec, altitud, capital, num_hab, zona_comarcal, destacada, nombre, longitud_dec, id, longitud) values (

                    '".$values[0]."','".$values[1]."','".$values[2]."','".$values[3]."','".$values[4]."','".$values[5]."', 
                    '".$values[6]."','".$values[7]."','".$values[8]."', '".$values[9]."','".$values[10]."','".$values[11]."', 
                    '".$values[12]."');";
            }

            else{

                $query = "insert into municipios (latitud, id_old, url, latitud_dec, altitud, capital, num_hab, zona_comarcal, destacada, nombre, longitud_dec, id, longitud) values (
                    '".$values[0]."','".$values[1]."','".$values[2]."','".$values[3]."','".$values[4]."','".$values[5]."', 
                    '".$values[6]."','".$values[7]."','".$values[8]."', '".$values[9]."','".$values[10]."','".$values[11]."');";
            }
            if(count($values)!=13){

                echo "<br>Linea: $k --> $query";
                printArray($values);
                //$conn->query($query);
            }
            
            echo "<br>Linea: $k --> $query";

            $conn->query($query);
            checkError($conn);
        }

	    return;
    }
}

?>