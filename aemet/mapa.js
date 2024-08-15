var customLabel = {
	0: {
		label: ''
	},
	1: {
		label: '*'
	}
};

var zoom = 11;
var lat, lng, rad;




async function initMap() {
	//console.log("initmap-init")
	const urlParams = new URLSearchParams(window.location.search);
	
	//Latitud
	if(urlParams.has('latitud') && urlParams.get("latitud")!=""){
		lat = urlParams.get("latitud");
	}
	else if(sessionStorage.getItem("latitud")!=null){
		lat = sessionStorage.getItem("latitud");
	}
	else{lat = 40.416967;}

	//Longitud
	if(urlParams.has('longitud') && urlParams.get("longitud")!=""){
		lng = urlParams.get("longitud");
	}
	else if(sessionStorage.getItem("longitud")!=null){
		lng = sessionStorage.getItem("longitud");
	}
	else{lng = -3.703434;}

	//Radio 
	if(urlParams.has('rad') && urlParams.get("rad")!=""){
		rad = urlParams.get("rad");
	}
	else if(sessionStorage.getItem("rad")!=null){
		rad = sessionStorage.getItem("rad");
	}
	else{rad = 15;}
	

	//Manage zoom map
	if(document.documentElement.clientWidth<720){
		zoom = 10;
	}
	else{
		zoom = 11;
	}


	if(rad>=20){zoom = Math.round(zoom - 1);}
	if(rad>=45){zoom = Math.round(zoom - 1.5);}

	try{
		document.getElementById("latitud").value = lat;
		document.getElementById("longitud").value = lng;
		document.getElementById("rad").value = rad;
	}catch(err){console.log(err);}

	//Encontrar municipios cerca del centro
	// console.log("espera")
	// let t0 = getTimestampInSeconds ();

    // await findMunClose(lat,lng,rad);
	
	// console.log("Tiempo exec: "+(t0-getTimestampInSeconds())+"s")
	// console.log("continua");
	// console.log(sessionStorage.getItem("munClose"));
	// console.log(jsonMunFinded)
	// console.log("initmap-afterpre")


	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(lat, lng),
		zoom: zoom
	});


	map.addListener('click', function(e) {
		placeMarkerAndPanTo(e.latLng, map);
	});


	// //Encontrar municipios cerca
	// let promise = new Promise((res, rej) => {
	// 	setTimeout(() => res("Now it's done!"), 100)
	// });
	// console.log("Buscando municipios");
	// //foundCLosest(lat,lng,rad);
	// let result = await promise; 
	// console.log("Encontrados")
	// console.log(JSON.parse(sessionStorage.getItem('munClose')));

	//Añade punto de ubicacion 
	var image = 'https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2'
	var pointCent = new google.maps.LatLng(lat, lng);
	var markerCent = new google.maps.Marker({
		map: map,
		position: pointCent,
		icon: image,
	});

	
	//Añade circulo de busqueda 
	const cityCircle = new google.maps.Circle({
		strokeColor: "#FF0000",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: "#FF0000",
		fillOpacity: 0.10,
		map,
		center: pointCent,
		radius: (rad*1000),
		clickable: false,
	});

	//Añadir marcadores
	let munClosestRad=sessionStorage.getItem("rad");

	var jsonMunFinded = JSON.parse(sessionStorage.getItem('munClose'));
	if(jsonMunFinded != null){
		let munClosest =jsonMunFinded[0];
		var markers = [];
		var infoWindow = new google.maps.InfoWindow;
	
	
		for(var i = 0 ; i< jsonMunFinded.length; i++){
			
			var munCLose = jsonMunFinded[i];
			if(munCLose.distance<=munClosest.distance){
				munClosest = munCLose;
				document.getElementById("munCerca").innerHTML = munClosest.nombre+" ("+munClosest.id+") a: "+munClosest.distance+"km";
			}
			else{
				document.getElementById("munCerca").innerHTML = "Ninguna estación cercana";
			}
		}
	}

	await fillMunCloseMap(pointCent,rad,map);
	//console.log(markers)
	//fillMapFounded(map, jsonMunFinded);
	
	//console.log("Termina initMap")
}
async function fillMunCloseMap(latLng,radR,map){
	let latR = latLng.lat();
	let longR = latLng.lng();


	let radR_latlng = radR/100;
	let distanceToCenter = distanceToCent(latR,longR);

	//40.3321
	//-3.3140
	let latMax = parseFloat(latR) + parseFloat(radR_latlng); 
	let latMin = parseFloat(latR) - parseFloat(radR_latlng);
	
	let longMax = parseFloat(longR) + parseFloat(radR_latlng);
	let longMin = parseFloat(longR) - parseFloat(radR_latlng);

	let res = $.getJSON('all_municipios.json', function (json) {
		
		let arrClose =[];

		for(var i = 0 ; i< json.length; i++){
			var obj = json[i];
			var latitudRead = obj.latitud_dec;
			var longitudRead = obj.longitud_dec;
			
			//Comprueba a grandes rasgos
			
			if(((latitudRead <= latMax) && (latMin<=latitudRead)) && ((longitudRead <= longMax) && (longMin<=longitudRead))){
				//dentro del circulo
				let distanceKm = distanceToCent(latitudRead,longitudRead);
				if(distanceKm<=parseFloat(radR)){

					item = {};
					item["nombre"] = obj.nombre;
					item["id"] = obj.id;
					item["lat"] = latitudRead;
					item["long"] = longitudRead;
					item["type"] = obj.destacada;
					item["distance"] = distanceKm;
					arrClose.push(item);

					var name = obj.nombre+" ("+obj.id+") a: "+distanceKm+"km";
					var type = obj.destacada;
					var point = new google.maps.LatLng(
						parseFloat(latitudRead),
						parseFloat(longitudRead));
					var icon = customLabel[type] || {};


					//Añadir en el mapa
					addMarker(point,icon,name,obj.id,map);
					// console.log("añadido "+name+" en func nueva")
				}
			}
		}

		//Get munClosest
		let munClosest = arrClose[0];
		for(var i = 0 ; i< arrClose.length; i++){
			let m = arrClose[i];
			if(parseFloat(m.distance)<=parseFloat(munClosest.distance)){
				munClosest = m;
			}
		}

		if(munClosest!=null){
			document.getElementById("munCerca").innerHTML = munClosest.nombre+" ("+munClosest.id+") a: "+munClosest.distance+"km";
		}
		else{
			document.getElementById("munCerca").innerHTML = "Ninguna estación cercana";
		}

		//Guardamos encontrados en session  storage
		sessionStorage.setItem('munClose', JSON.stringify(arrClose));
		sessionStorage.setItem('munClosest', JSON.stringify(munClosest));

		return;
	});

}
function addMarker(latLng,icon,text,id,map){



	// var infowincontent = document.createElement('div');
	// var strong = document.createElement('strong');
	
	// strong.textContent = latLng.lat()+' ,  '+latLng.lng()
	// infowincontent.appendChild(strong);
	// infowincontent.appendChild(document.createElement('br'));

	var lati= latLng.lat();
	var longi = latLng.lng();

	var infowindow2 = new google.maps.InfoWindow({
		content:'<p style="color:black">'+text+'</p><br><button onclick=(document.location.href="'+"/aemet/tiempo.html?id="+id+'")>'+'Tiempo'+'</button>'
		//content:'<button>'+latLng.t+'</button>'
		//content: '<button>'+getQueryVariable('latitud')+' ,  '+getQueryVariable('longitud')+'</button>'
	});

	var marker2 = new google.maps.Marker({
		position: latLng,
		map: map,
		label: icon.label
	});


	marker2.addListener('click',function(e){
		//marker2.setLabel(getQueryVariable('latitud')+' ,  '+getQueryVariable('longitud'));
		//infoWindow.setContent(infowincontent);
		infowindow2.open(map, marker2);
	});

}

function placeMarkerAndPanTo(latLng, map){
	//var image = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
	var image = 'https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png'

	// var infowincontent = document.createElement('div');
	// var strong = document.createElement('strong');
	
	// strong.textContent = latLng.lat()+' ,  '+latLng.lng()
	// infowincontent.appendChild(strong);
	// infowincontent.appendChild(document.createElement('br'));

	var lati= latLng.lat();
	var longi = latLng.lng();

	var infowindow2 = new google.maps.InfoWindow({
		content:'<button onclick='+'goTo('+lati+','+longi+','+document.getElementById("rad").value+')'+'>'+'Click para simular localizacion'+'</button>'
		//content:'<button>'+latLng.t+'</button>'
		//content: '<button>'+getQueryVariable('latitud')+' ,  '+getQueryVariable('longitud')+'</button>'
	});

	var marker2 = new google.maps.Marker({
		position: latLng,
		map: map,
		icon: image,
		animation: google.maps.Animation.DROP
	});


	marker2.addListener('click',function(e){
		//marker2.setLabel(getQueryVariable('latitud')+' ,  '+getQueryVariable('longitud'));
		//infoWindow.setContent(infowincontent);
		infowindow2.open(map, marker2);
	});

	map.panTo(latLng);
	//map.zoom()
}

// function downloadUrl(url, callback) {
// 	var request = window.ActiveXObject ?
// 	new ActiveXObject('Microsoft.XMLHTTP') :
// 	new XMLHttpRequest;

// 	request.onreadystatechange = function() {
// 		if (request.readyState == 4) {
// 			request.onreadystatechange = doNothing;
// 			callback(request, request.status);
// 		}
// 	};

// 	request.open('GET', url, true);
// 	request.send(null);

// }

// function getQueryVariable(variable) {
// 	return(sessionStorage.getItem(variable));
// }

async function goTo(a,b,c,url){
	if(!url)url = "/aemet/mapa.html";
	if(!a)a = 40.416967;
	if(!b)b = -3.703434;
	if(!c)c = 15;

	
	sessionStorage.removeItem("latitud");
	sessionStorage.setItem("latitud",a);
	sessionStorage.removeItem("longitud");
	sessionStorage.setItem("longitud",b);
	sessionStorage.removeItem("rad");
	sessionStorage.setItem("rad",c);


	//Ir a pagina que carga los datos
	document.location.href = url;
}

function doNothing() {}

function distanceToCent(latT, longT){
	
	let latCenter = parseFloat(document.getElementById("latitud").value);
	let longCenter = parseFloat(document.getElementById("longitud").value);
	
	//d en km
	let distance_km = (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latT,longT), new google.maps.LatLng(latCenter,longCenter)) / 1000).toFixed(2);

	return distance_km;
}

async function findMunClose(latR,longR,radR){
	// console.log("Entra findMunClose")
	
	let radR_latlng = radR/100;
	let distanceToCenter = distanceToCent(latR,longR);

	//40.3321
	//-3.3140
	let latMax = parseFloat(latR) + parseFloat(radR_latlng); 
	let latMin = parseFloat(latR) - parseFloat(radR_latlng);
	
	let longMax = parseFloat(longR) + parseFloat(radR_latlng);
	let longMin = parseFloat(longR) - parseFloat(radR_latlng);

	let res = $.getJSON('all_municipios.json', function (json) {
		
		let arrClose =[];

		for(var i = 0 ; i< json.length; i++){
			var obj = json[i];
			var latitudRead = obj.latitud_dec;
			var longitudRead = obj.longitud_dec;
			
			//Comprueba a grandes rasgos
			
			if(((latitudRead <= latMax) && (latMin<=latitudRead)) && ((longitudRead <= longMax) && (longMin<=longitudRead))){
				//dentro del circulo
				let distanceKm = distanceToCent(latitudRead,longitudRead);
				if(distanceKm<=parseFloat(radR)){

					item = {};
					item["nombre"] = obj.nombre;
					item["id"] = obj.id;
					item["lat"] = latitudRead;
					item["long"] = longitudRead;
					item["type"] = obj.destacada;
					item["distance"] = distanceKm;
					arrClose.push(item);
				}
			}
		}

		//Guardamos encontrados en session  storage
		
		sessionStorage.setItem('munClose', JSON.stringify(arrClose));

		return;
	});
	
	console.log("Sale findmunclose");
}

function getInfoContent(string){
	var button = document.createElement("button");
	button.innerHTML = string;
	// var infowincontent = document.createElement('div');
	// var strong = document.createElement('strong');
	// strong.textContent = string;
	// infowincontent.appendChild(strong);
	// infowincontent.appendChild(document.createElement('br'));

	return button;
}

function fillMapFounded(map, munCloseFinded){
	//console.log("fillMapFounded-init")

	
	let munClosestRad=sessionStorage.getItem("rad");
	for(var i=0;i<10000; i++){
	}
	let munClosest =munCloseFinded[0];

	
	for(var i = 0 ; i< munCloseFinded.length; i++){
		
		var munCLose = munCloseFinded[i];
		if(munCLose.distance<munClosest.distance){
			munClosest = munCLose;
		}
		var name = munCLose.nombre+" ("+munCLose.id+") a: "+munCLose.distance+"km";
		var type = munCLose.type;
		var point = new google.maps.LatLng(
			parseFloat(munCLose.lat),
			parseFloat(munCLose.long));

		
		var infowincontent = document.createElement('div');
		var strong = document.createElement('strong');
		strong.textContent = name
		infowincontent.appendChild(strong);
		infowincontent.appendChild(document.createElement('br'));

		

		var icon = customLabel[type] || {};
		var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
		var marker = new google.maps.Marker({
			map: map,
			position: point,
			label: icon.label,
			title: name,
			optimized: false
		});

		// marker.data = name;

		// var infowindow = new google.maps.InfoWindow({
		// 	//content:'<p>'+name+'</p>'
		// 	content:'<button>'+"hola"+'</button>'
		// 	//content: '<button>'+getQueryVariable('latitud')+' ,  '+getQueryVariable('longitud')+'</button>'
		// });

		google.maps.event.addListener(marker, 'click', function(e) {
			//console.log(marker.getTitle());
			
			infoWindow.close();
			var infowincontent = document.createElement('div');
			var strong = document.createElement('strong');
			strong.textContent = marker.data;
			infowincontent.appendChild(strong);
			infowincontent.appendChild(document.createElement('br'));
			infoWindow.setContent(infowincontent);
			infoWindow.open(map, marker);   
		});
		// marker.addListener('click', function(e) {
		// 	infoWindow.close();
			

		// 	console.log(e.latLng.lat(),e.latLng.lng());
		// 	console.log(e)
		// 	//infoWindow.setContent(infowincontent);
		// 	infoWindow.open(map, marker);

		// });

		// console.log("Añadido: "+name);

	}
	console.log("fillMapFounded-fin")
}

function geolocateMe(){
	console.log(map)
	const options = {
		enableHighAccuracy: true,
		timeout: 5000,
	  };

	const successCallback = (position) => {
		//console.log(position);
		let latGeo = position.coords.latitude;
		let lngGeo = position.coords.longitude;
		let accGeo = position.coords.accuracy;
		//console.log("loc(lat: "+latGeo+", long: "+lngGeo+", precision: "+accGeo+"m");
		goTo(latGeo,lngGeo, Math.round(accGeo/1000));
	  };
	  
	  const errorCallback = (error) => {
		alert("No se ha podido obtener la localización.");
	  };
	  
	  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
	  
}

