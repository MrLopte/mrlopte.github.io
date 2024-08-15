//FUNCIONES GENERALES
var petResp = false;

const reqJson = async (url)=>{
	//Peticion url
	if(petResp == true)console.log("--- Pett a: ---")
	if(petResp == true)console.log(url)
	if(petResp == true)console.log("---------------")
	try{
		const response = await fetch(url, new Headers().append('Content-Type','text/plain; charset=iso-8859-15')).then(handleErrors)
		.then(response => response.arrayBuffer())
		.then(buffer => {
			let decoder = new TextDecoder("iso-8859-1");
			let text = decoder.decode(buffer);
			handleText(text);
			return text;
		});

		if(petResp == true)console.error("response rcv: "+response);
		
		let respMan = manageResponse(response);
		return respMan;

	}catch(Exception){
		console.log("Error response reqJson")
		let resp = [];
		item = {};
		item["ok"] = false;
		item["statusText"] = Exception.toString();
		item["urlReq"] = url;
		
		let json = JSON.stringify(item);
		return JSON.parse(json);
	}
}

function handleErrors(response) {
	
    if (response.hasOwnProperty("ok") & response.ok == false){
		console.log("Err response: ")
		console.error(response);
        throw Error(response.statusText);
    }
	
    return response;
}

const handleText = async (text) =>{
	responseHandled = text;
}

//borrar?
function validaTexto(texto ) {
    // Variable que usaremos para determinar si el input es valido
    let isValid = false;

    // El input que queremos validar
    const input = document.createElement("input").value = texto;

    //El div con el mensaje de advertencia:
    const message = document.getElementById('message');

    input.willValidate = false;

    // El tamaño maximo para nuestro input
    const maximo = 35;

    // El pattern que vamos a comprobar
    const pattern = new RegExp('^[A-Z]+$', 'i');

    // Primera validacion, si input esta vacio entonces no es valido
    if(!input.value) {
      isValid = false;
    } else {
      // Segunda validacion, si input es mayor que 35
      if(input.value.length > maximo) {
        isValid = false;
      } else {
        // Tercera validacion, si input contiene caracteres diferentes a los permitidos
        if(!pattern.test(input.value)){ 
        // Si queremos agregar letras acentuadas y/o letra ñ debemos usar
        // codigos de Unicode (ejemplo: Ñ: \u00D1  ñ: \u00F1)
          isValid = false;
        } else {
          // Si pasamos todas la validaciones anteriores, entonces el input es valido
          isValid = true;
        }
      }
    }
}

const printJson = async (url) =>{
	let json = await reqJson(url);
	console.log(json);
}

function manageFloatTime(idDivManage, idIcon){
    
    let changeDiv = document.getElementById(idDivManage);
	let butt = document.getElementById(idIcon);
    
    if(window.getComputedStyle(changeDiv).visibility  == "hidden"){
        changeDiv.style.visibility  = "visible";
		butt.setAttribute("class","icon icon-color");
		$('html, body').animate({
			scrollTop: $(idDivManage).offset().top
		}, 1000);
    }
    else{
        changeDiv.style.visibility = "hidden";
		butt.setAttribute("class","icon icon-color-muted");
    }

    //manageMainFloatButt(idDivManage, document.getElementById());
}

function printData(dataPromise){
	console.log(dataPromise);
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

//borrar?
function loadJSON() {
    $.getJSON('all_municipios.json', function (json) {
        console.log(json);
    });
}

function getTimestampInSeconds () {
	return Math.floor(Date.now() / 1000)
}

function log(texto, variable){
	if(texto==null){texto="Sin descripcion: "}
	if(variable==null){variable=", Sin variable"}
	console.warn("log ["+texto+""+variable+"]");
}

function manageResponse(response){
	item = {};		
		
	if(response.substring(0,1) == "[" || response.substring(0,1) == "{"){
		if(petResp == true){console.log("Es JSON")}
		return JSON.parse(response);
	}
	else if(response.substring(0,3) == "GIF"){
		if(petResp == true){console.log("Es IMAGEN")}
		item["type"] = "image";
		item["response"] = response;
		let respItm = JSON.stringify(item);

		return  JSON.parse(respItm);
	}
	else{
		if(petResp == true){console.log("Es TEXTO")}
		item["type"] = "text";
		item["response"] = response;
		let respItm = JSON.stringify(item);
		return  JSON.parse(respItm);
	}
}

//FUNCIONES RELATIVAS API AEMET
var hvalor = "h";
var mmvalor = "mm";
var gCvalor = "°C";
var pPvalor = "(%)";
var vVvalor = "(km/h)";

const getAemetData = async (url) =>{
	//Primera peticion, recibe url de datos y metadatos
	let jsonFirstResponse = await reqJson(url);
	
	if (jsonFirstResponse.hasOwnProperty("ok") & jsonFirstResponse.ok == false)
		return jsonFirstResponse;
	
	//Segunda peticion a url datos para obtener json
	let jsonFinalResp = await reqJson(jsonFirstResponse.datos);

	return jsonFinalResp[0];
}

async function getAemetUrlData(divToFill, url){
	
	let jsonFirstResponse = await reqJson(url);

	if (jsonFirstResponse.hasOwnProperty("ok") & jsonFirstResponse.ok == false){
		return jsonFirstResponse;
	}
	else if(jsonFirstResponse.estado == 404){
		alert(jsonFirstResponse.estado+"\n\n\n"+jsonFirstResponse.descripcion);
		return jsonFirstResponse;
	}
	else{
			if(divToFill!=null){
				divToFill.innerHTML = '';
				let a = document.createElement("iframe");
				a.style="width:100%; height:100vh; background-color:white";
				a.id = "goAemetData";
				a.src = jsonFirstResponse.datos;
				//a.classList.add("nav__elements__a");
				//a.innerHTML = "Go to AEMET data!";
				divToFill.appendChild(a);

				reqJson(jsonFirstResponse.datos).then(resp =>{
					console.error(resp)
					if(resp.hasOwnProperty("type") & resp.type =="image"){
						
						console.log("IMAGE CONFIRMED")
						let img = document.createElement("img");
						img.src = resp.response;
						divToFill.appendChild(img);
					}
					if(resp.hasOwnProperty("type") & resp.type =="text"){
						
						console.log("TEXTO CONFIRMED")
					}
					
				});

			}
			if(jsonFirstResponse.hasOwnProperty("paths")){
				console.log("paths")
				console.log(jsonFirstResponse.paths);
				return JSON.stringify(jsonFirstResponse.paths);
			}
            
		//openInNewTab(JSON.stringify(jsonFirstResponse.datos));
		return JSON.stringify(jsonFirstResponse.datos);
	}

}

function searchMun() {
	let finded = [];

	$.getJSON('all_municipios.json', function (json) {
	
	let name = document.getElementById("mun").value;
	name = capitalizeFirstLetter(name);

	if(name==null || name==""){
		alert("Introduce Municipio.");
	}
	else{
		for(var i = 0 ; i< json.length; i++){
			var obj = json[i];
			var arr = obj["nombre"];
			if(arr.search(name)>=0){
				item = {};
				item["nombre"] = obj.nombre;
				item["id"] = obj.id;
				finded.push(item);
			}
		}

		//Comprueba si la busqueda es demasiado amplia
		if(finded.length>50){
			alert("Parámetros de búsqueda muy amplios, pruebe algo mas específico.")
		}
		else{
			//Guardamos encontrados en session  storage
			sessionStorage.setItem('finded', JSON.stringify(finded));

			//Guardamos timestamp para borrar en 5min
			sessionStorage.setItem('timestamp', getTimestampInSeconds ());

			//Ir a pagina que carga los datos
			if(finded.length==1){
				document.location.href = "tiempo.html?id="+finded[0].id;
				
			}else if(finded.length>0){

				document.location.href = "tiempo.html";
			}
			else{
				alert("No se encuentra municipio, revise el nombre introducido.\n");
			}
		}
	}
	
	
	//var result = json.jsonMun.filter(function(e){return e.nombre == name});
	//console.log(jsonMun.filter(val =>  val.nombre ===name ));
	});
}

function getMunbyId(id){
	
	let municipioID = [];
	if(id=="" || id==null){
		return "Error";
	}

	sessionStorage.removeItem("munID");
	$.getJSON('all_municipios.json', function (json) {
		for(var i = 0 ; i< json.length; i++){
			var obj = json[i];
			var arr = obj["id"];
			if(arr.search(id)>=0){
				item2 = {};
				item2["hola"] = obj.nombre;
				item2["adios"] = obj.id;
				//Json escape Quitar \" por ''
				//JSON.stringify(obj);//.replace(/\\\"/g,"");
				log("Mun encontrado: ",JSON.stringify(obj));
				municipioID.push(obj);
			}
		}
		//Guardamos municipio en session  storage
		sessionStorage.setItem('munID', JSON.stringify(municipioID));
	});

	return;

}

function checkFinded(){
	let current = getTimestampInSeconds ();
	let tS = sessionStorage.getItem('timestamp');
	if(tS!=null){
		let segundos = current- tS;
		//console.log("Segundos encontrados: "+segundos+"s");

		//Cargar si menor de 5 min, si false borra
		if(segundos<300){
			return true;
		}
		else{
			//console.log("Borrando tabla");
			sessionStorage.clear();
			return false;
		}
	}
	//console.log("No hay tabla");
	return false;
}

function toggleDivs(showFind){
	if(showFind){
		document.getElementById("Encontrados").style = "display:block"

		document.getElementById("datosMun").style = "display:none";
		document.getElementById("horariaDataCielo").style = "display:none";
		document.getElementById("horariaDataPrecip").style = "display:none";
		document.getElementById("horariaDataTemp").style = "display:none";
		document.getElementById("horariaDataViento").style = "display:none";
		document.getElementById("horariaDataHumedad").style = "display:none";
		document.getElementById("horariaDataNieve").style = "display:none";
	}
	else{
		document.getElementById("Encontrados").style = "display:none"
		
		document.getElementById("datosMun").style = "display:block";
		document.getElementById("horariaDataCielo").style = "display:block";
		document.getElementById("horariaDataPrecip").style = "display:block";
		document.getElementById("horariaDataTemp").style = "display:block";
		document.getElementById("horariaDataViento").style = "display:block";
		document.getElementById("horariaDataHumedad").style = "display:block";
		document.getElementById("horariaDataNieve").style = "display:block";
	}
}

function loadFinded(){
	//Mostrar lista encontrados
	toggleDivs(true);
	

	let findedValid = JSON.parse(sessionStorage.getItem('finded'));


	// console.log("loadFinded-Cargando "+findedValid.length+" elementos");

	if(findedValid.length<=0){
		console.log("loadFinded-Cargando datos por defecto: Madrid");
		//Si no hay encontrados cargar datos Madrid
		loadMunData();
		return;
	}
	if(findedValid.length==1){
		// console.log("loadFinded-Cargando datos de:"+findedValid[0].id);
		loadMunData(findedValid[0].id);
		return;
	}
	else{
		let div = document.getElementById("findedList");
		for(var i = 0 ; i< findedValid.length; i++){
			let p = document.createElement("p");
			p.setAttribute("id", findedValid[i].id);
			p.classList.add("round-up");
			p.classList.add("color-accent");
			p.style = "position: relative; margin:auto;"
			p.innerHTML = findedValid[i].nombre;
			p.addEventListener("click", function(event) {
				loadMunData(p.getAttribute("id"));
			});

			// console.log("Added: "+p.innerHTML);
			div.appendChild(p);
		}
	}
}

function loadMunData(id){
	log("Id recibido: ",id);
	//Ocultar lista Encontrados
	document.getElementById("Encontrados").style = "display:none"
	document.getElementById("datosMun").style = "display:block";

	
	if(id==null){
		id="id28079";
	}

	document.getElementById("titleMun").innerHTML = "Cargando datos...";
	
	//Get data mun
	//getMunbyId(id);
	//let municipioData = JSON.parse(sessionStorage.getItem('munID'))[0];

	// PREDICCION HORARIA 
	horaria(id);
	//let horariaReq = JSON.parse(sessionStorage.getItem('horaria'));
		//console.log(horariaReq);
	diaria(id);
	
}

function horaria(id){
	sessionStorage.removeItem("horaria");
	log("Preguntando a Aemet sobre: "+id)
	
	//let idMun = document.getElementById("idMun");
	let url = urlHoraria+id.slice(2);
        getAemetData(url+"?api_key="+apiKey)
	        .then(datos =>{
				if (datos.hasOwnProperty("ok") & datos.ok == false){
					console.error(datos)
                    alert("Error response: "+ datos.statusText);
					document.getElementById("response").innerHTML = "Algo salió mal";
					return;
				}
                sessionStorage.setItem('horaria', JSON.stringify(datos));
				let horariaReq = datos;
				console.log("Horaria datos:")
				console.log(datos);
				console.log("Dia tomorrow:")
				console.log(datos.prediccion.dia[1])

				//Manage data
				let elabR = horariaReq.elaborado;
				let origenR = horariaReq.origen;
				let nombreR = horariaReq.nombre;
				let prediccR = horariaReq.prediccion["dia"];
				// console.log(prediccR)
				let dia0 = prediccR[0];
				let dia1 = prediccR[1];
				let dia2 = prediccR[2];
				// console.log(dia0);

				//Export data 
				// titleMun.innerHTML = nombreR;

				createEstCieloHor(dia0.estadoCielo, 0);
				createEstCieloHor(dia1.estadoCielo, 1);
				createEstCieloHor(dia2.estadoCielo, 2);

				createPrecipHor(dia0.precipitacion, dia0.probPrecipitacion, 0);
				createPrecipHor(dia1.precipitacion, dia1.probPrecipitacion, 1);
				createPrecipHor(dia2.precipitacion, dia2.probPrecipitacion, 2);
				
				createTempSensHor(dia0.temperatura, dia0.sensTermica, 0);
				createTempSensHor(dia1.temperatura, dia1.sensTermica, 1);
				createTempSensHor(dia2.temperatura, dia2.sensTermica, 2);
				// dia0_fecha.innerHTML = dia0.fecha;
				// dia1_fecha.innerHTML = dia1.fecha;
				// dia2_fecha.innerHTML = dia2.fecha;

				//idMun.innerHTML = "Dia 0 Amanecer: "+dia0.orto+" Atardecer: "+dia0.ocaso;
				

				
			});
}

function createEstCieloHor(cielo, index){
	let string = "dia"+index;
	let initHora = cielo[0].periodo;
	let finHora = cielo[cielo.length-1].periodo;
	
	let divContainer = document.getElementById(string+"_estadocielo");

	if(initHora!=0){
		for(var r=0; r<initHora;r++){
			
			let divHora = document.createElement("div");
			divHora.id = string+"_estadocielo-hor"+index;
			divHora.classList.add("tiempo-especifico");
	
			//img
			let img = document.createElement("img");
			img.id = string+"_estadocielo-hor"+index+"-img";
			img.classList.add("img-time-icon");
			img.src = "/images/time/image_.png"
			divHora.appendChild(img);
	
			//desc
			let desc = document.createElement("h5");
			desc.id = string+"_estadocielo-hor"+index+"-desc";
			desc.innerHTML = "-";
			divHora.appendChild(desc);
	
			//Hora
			let hor = document.createElement("h5");
			hor.classList.add("hora-tiempo");
			hor.id = string+"_estadocielo-hor"+index+"-hor";
			if(r<10){hor.innerHTML = "0"+r+" "+hvalor;}
			else{hor.innerHTML = r+" "+hvalor;}
			divHora.appendChild(hor);
	
			divContainer.appendChild(divHora);
		}
	}
	for(var i=initHora; i<=finHora; i++){
		
		let divHora = document.createElement("div");
		divHora.id = string+"_estadocielo-hor"+index;
		divHora.classList.add("tiempo-especifico");

		//img
		let img = document.createElement("img");
		img.id = string+"_estadocielo-hor"+index+"-img";
		img.classList.add("img-time-icon");
		img.src = "/images/time/image_"+cielo[i-initHora].value+".png"
		divHora.appendChild(img);

		//desc
		let desc = document.createElement("h5");
		desc.id = string+"_estadocielo-hor"+index+"-desc";
		desc.innerHTML = cielo[i-initHora].descripcion;
		divHora.appendChild(desc);

		//Hora
		let hor = document.createElement("h5");
		hor.classList.add("hora-tiempo");
		hor.id = string+"_estadocielo-hor"+index+"-hor";
		hor.innerHTML = cielo[i-initHora].periodo+" "+hvalor;;
		divHora.appendChild(hor);

		divContainer.appendChild(divHora);
	}

	if(finHora<23){
		for(i; i<24;i++){
			let divHora = document.createElement("div");
			divHora.id = string+"_estadocielo-hor"+index;
			divHora.classList.add("tiempo-especifico");
	
			//img
			let img = document.createElement("img");
			img.id = string+"_estadocielo-hor"+index+"-img";
			img.classList.add("img-time-icon");
			img.src = "/images/time/image_.png"
			divHora.appendChild(img);
	
			//desc
			let desc = document.createElement("h5");
			desc.id = string+"_estadocielo-hor"+index+"-desc";
			desc.innerHTML = "-";
			divHora.appendChild(desc);
	
			//Hora
			let hor = document.createElement("h5");
			hor.classList.add("hora-tiempo");
			hor.id = string+"_estadocielo-hor"+index+"-hor";
			hor.innerHTML = i+" "+hvalor;;
			divHora.appendChild(hor);
	
			divContainer.appendChild(divHora);
		}
	}

	//Mostramos datos
	document.getElementById("horariaDataCielo").style = "visibility:visible";
}

function createPrecipHor(precip, probPrecip, index){
	let string = "dia"+index;
	let initHora = precip[0].periodo;
	let finHora = precip[precip.length-1].periodo;
	
	let initPeriodo = probPrecip[0].periodo;
	let finPeriodo = probPrecip[probPrecip.length-1].periodo;


	let divContainer = document.getElementById(string+"_precip");

	if(initHora!=0){
		for(var r=0; r<initHora;r++){
			
			let divHora = document.createElement("div");
			divHora.id = string+"_precip-hor"+index;
			divHora.classList.add("tiempo-especifico");
	
			//img
			// let img = document.createElement("img");
			// img.id = string+"_estadocielo-hor"+index+"-img";
			// img.src = "/images/time/image_.png"
			// divHora.appendChild(img);
	
			//desc
			let desc = document.createElement("h5");
			desc.id = string+"_precip-hor"+index+"-desc";
			desc.innerHTML = "- "+mmvalor;
			divHora.appendChild(desc);
	
			//Hora
			let hor = document.createElement("h5");
			hor.classList.add("hora-tiempo");
			hor.id = string+"_precip-hor"+index+"-hor";
			if(r<10){hor.innerHTML = "0"+r+" "+hvalor;}
			else{hor.innerHTML = r+" "+hvalor;}
			divHora.appendChild(hor);
	
			divContainer.appendChild(divHora);
		}
	}
	for(var i=initHora; i<=finHora; i++){
		
		let divHora = document.createElement("div");
		divHora.id = string+"_precip-hor"+index;
		divHora.classList.add("tiempo-especifico");

		// //img
		// let img = document.createElement("img");
		// img.id = string+"_estadocielo-hor"+index+"-img";
		// img.src = "/images/time/image_"+cielo[i-initHora].value+".png"
		// divHora.appendChild(img);

		//desc
		let desc = document.createElement("h5");
		desc.id = string+"_precip-hor"+index+"-desc";
		desc.innerHTML = precip[i-initHora].value +" "+mmvalor;
		divHora.appendChild(desc);

		//Hora
		let hor = document.createElement("h5");
		hor.classList.add("hora-tiempo");
		hor.id = string+"_precip-hor"+index+"-hor";
		hor.innerHTML = precip[i-initHora].periodo+" "+hvalor;;
		divHora.appendChild(hor);

		divContainer.appendChild(divHora);
	}

	if(finHora<23){
		for(i; i<24;i++){
			let divHora = document.createElement("div");
			divHora.id = string+"_precip-hor"+index;
			divHora.classList.add("tiempo-especifico");
	
			// //img
			// let img = document.createElement("img");
			// img.id = string+"_estadocielo-hor"+index+"-img";
			// img.src = "/images/time/image_.png"
			// divHora.appendChild(img);
	
			//desc
			let desc = document.createElement("h5");
			desc.id = string+"_precip-hor"+index+"-desc";
			desc.innerHTML = "- "+mmvalor;
			divHora.appendChild(desc);
	
			//Hora
			let hor = document.createElement("h5");
			hor.classList.add("hora-tiempo");
			hor.id = string+"_precip-hor"+index+"-hor";
			hor.innerHTML = i+" "+hvalor;;
			divHora.appendChild(hor);
	
			divContainer.appendChild(divHora);
		}
	}

	//Mostramos datos
	document.getElementById("horariaDataCielo").style = "visibility:visible";
}

function createTempSensHor(temp, sens, index){
	let string = "dia"+index;
	let initHora = temp[0].periodo;
	let finHora = temp[temp.length-1].periodo;

	let divContainer = document.getElementById(string+"_temp_sens");

	if(initHora!=0){
		for(var r=0; r<initHora;r++){
			
			let divHora = document.createElement("div");
			divHora.id = string+"_temp_sens-hor"+index;
			divHora.classList.add("tiempo-especifico");
	
			//img
			// let img = document.createElement("img");
			// img.id = string+"_estadocielo-hor"+index+"-img";
			// img.classList.add("img-time-icon");
			// img.src = "/images/time/image_.png"
			// divHora.appendChild(img);
	
			//Temp
			let temp = document.createElement("h5");
			temp.id = string+"_temp_sens-hor"+index+"-temp";
			temp.innerHTML = "-";
			divHora.appendChild(temp);

			//Sens
			let sens = document.createElement("h6");
			sens.id = string+"_temp_sens-hor"+index+"-sens";
			sens.classList.add("sens-tiempo");
			sens.innerHTML = "-";
			divHora.appendChild(sens);
	
			//Hora
			let hor = document.createElement("h5");
			hor.classList.add("hora-tiempo");
			hor.id = string+"_temp_sens-hor"+index+"-hor";
			if(r<10){hor.innerHTML = "0"+r+" "+hvalor;}
			else{hor.innerHTML = r+" "+hvalor;}
			divHora.appendChild(hor);
	
			divContainer.appendChild(divHora);
		}
	}
	for(var i=initHora; i<=finHora; i++){
		
		let divHora = document.createElement("div");
		divHora.id = string+"_temp_sens-hor"+index;
		divHora.classList.add("tiempo-especifico");

		//img
		// let img = document.createElement("img");
		// img.id = string+"_estadocielo-hor"+index+"-img";
		// img.classList.add("img-time-icon");
		// img.src = "/images/time/image_"+cielo[i-initHora].value+".png"
		// divHora.appendChild(img);

		//Temp
		let tempH = document.createElement("h5");
		tempH.id = string+"_temp_sens-hor"+index+"-tempH";
		tempH.innerHTML = temp[i-initHora].value+gCvalor;
		divHora.appendChild(tempH);

		//Sens
		let sensH = document.createElement("h6");
		sensH.classList.add("sens-tiempo");
		sensH.id = string+"_temp_sens-hor"+index+"-sensH";
		sensH.innerHTML = "("+sens[i-initHora].value+gCvalor+")";
		divHora.appendChild(sensH);

		//Hora
		let hor = document.createElement("h5");
		hor.classList.add("hora-tiempo");
		hor.id = string+"_temp_sens-hor"+index+"-hor";
		hor.innerHTML = temp[i-initHora].periodo+" "+hvalor;;
		divHora.appendChild(hor);

		divContainer.appendChild(divHora);
	}

	if(finHora<23){
		for(i; i<24;i++){
			let divHora = document.createElement("div");
			divHora.id = string+"_temp_sens-hor"+index;
			divHora.classList.add("tiempo-especifico");
	
			//img
			// let img = document.createElement("img");
			// img.id = string+"_estadocielo-hor"+index+"-img";
			// img.classList.add("img-time-icon");
			// img.src = "/images/time/image_.png"
			// divHora.appendChild(img);
	
			//Temp
			let temp = document.createElement("h5");
			temp.id = string+"_temp_sens-hor"+index+"-temp";
			temp.innerHTML = "-";
			divHora.appendChild(temp);

			//Sens
			let sens = document.createElement("h6");
			sens.classList.add("sens-tiempo");
			sens.id = string+"_temp_sens-hor"+index+"-sens";
			sens.innerHTML = "-";
			divHora.appendChild(sens);

			//Hora
			let hor = document.createElement("h5");
			hor.classList.add("hora-tiempo");
			hor.id = string+"_temp_sens-hor"+index+"-hor";
			hor.innerHTML = i+" "+hvalor;;
			divHora.appendChild(hor);
	
			divContainer.appendChild(divHora);
		}
	}

	//Mostramos datos
	document.getElementById("horariaDataTemp").style = "visibility:visible";
}

function diaria(id){
	let titleMun = document.getElementById("titleMun");
	
	let url = urlDiaria+id.slice(2);
        getAemetData(url+"?api_key="+apiKey)
	        .then(datos =>{
				if (datos.hasOwnProperty("ok") & datos.ok == false){
					console.error(datos)
                    alert("Error response: "+ datos.statusText);
					document.getElementById("response").innerHTML = "Algo salió mal";
					return;
				}
				titleMun.innerHTML = datos.nombre+" ("+datos.provincia+")";
				let dia0 = datos.prediccion.dia[0];
				let dia1 = datos.prediccion.dia[1];
				let dia2 = datos.prediccion.dia[2];

				parseDiariaDia(dia0,0);
				parseDiariaDia(dia1,1);
				parseDiariaDia(dia2,2);
			});
}

function parseDiariaDia(dia, index){

	let string = "dia"+index;

	//fecha
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	let date = new Date(dia.fecha).toLocaleDateString('es-ES', options);

	
	//fechas horaria
	document.getElementById(string+"_fecha").innerHTML = date;
	document.getElementById("fecha-disp"+index).innerHTML = date;
	document.getElementById("fecha-disp"+index+"-precip").innerHTML = date;
	document.getElementById("fecha-disp"+index+"-temp").innerHTML = date;
	//imagen
	let imgEst = dia.estadoCielo;
	for(var i=0; i<imgEst.length; i++){
		if(imgEst[i].periodo =="00-12"){
			document.getElementById(string+"_manana-img").src = "/images/time/image_"+imgEst[i].value+".png"
		}
		if(imgEst[i].periodo =="12-24"){
			document.getElementById(string+"_tarde-img").src = "/images/time/image_"+imgEst[i].value+".png"
		}
	}

	//temp
	document.getElementById(string+"_manana_temp").innerHTML = dia.temperatura.maxima+"↑"+gCvalor+"/"+dia.temperatura.minima+"↓"+gCvalor;	
	document.getElementById(string+"_tarde_temp").innerHTML = dia.temperatura.maxima+"↑"+gCvalor+"/"+dia.temperatura.minima+"↓"+gCvalor;	
	
	//precip
	let prec = dia.probPrecipitacion;
	for(var i=0; i<prec.length; i++){
		if(prec[i].periodo =="00-12"){
			document.getElementById(string+"_manana_prec").innerHTML = prec[i].value+pPvalor+" lluvia";
		}
		if(prec[i].periodo =="12-24"){
			document.getElementById(string+"_tarde_prec").innerHTML = prec[i].value+pPvalor+" lluvia";
		}
	}

	//vien
	let vien = dia.viento;
	for(var i=0; i<vien.length; i++){
		if(vien[i].periodo =="00-12"){
			document.getElementById(string+"_manana_vien").innerHTML = vien[i].velocidad+vVvalor+" viento";
		}
		if(vien[i].periodo =="12-24"){
			document.getElementById(string+"_tarde_vien").innerHTML = vien[i].velocidad+vVvalor+" viento";
		}
	}
	
}

var jsonMun = new Array();
var responseHandled;
const urlServer = "https://opendata.aemet.es/"
let urlRequestAllEst = urlServer+"opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones/";
let urlHoraria = urlServer+"opendata/api/prediccion/especifica/municipio/horaria/";
let urlDiaria = urlServer+"opendata/api/prediccion/especifica/municipio/diaria/";
const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsdWlzZXRlNzc3QGdtYWlsLmNvbSIsImp0aSI6ImE0Yjg1NzE5LTQyNmYtNDc1Yy04MGE3LTQ0OGE3ZDdjOWNjZSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTIzODYxNTkyLCJ1c2VySWQiOiJhNGI4NTcxOS00MjZmLTQ3NWMtODBhNy00NDhhN2Q3YzljY2UiLCJyb2xlIjoiIn0.OpPOml5MjQINu-lSoFBTQiZ2dU2UU5tPtlcNAZ0SONs";

// getAemetData(urlRequest+"?api_key="+apiKey)
// 	.then(datos => printData(datos));
