
function getUrlData(url){
    let textToFil = document.getElementById("urlData");
    const urlParams = new URLSearchParams(window.location.search);
    let divFill = document.getElementById("pFill");
    // (IMPLEMENTAR) cosas de seguridad

    //Obtenemos la pet de la url del navegador
    if(urlParams.has('urlQuery')){
        url = urlParams.get('urlQuery');

        
	// let b = document.createElement("p");
	// b.style="width:100%; height:100vh;";
	// b.id = "goAemetData-txt";
	// reqJson(urlServer+"AEMET_OpenData_specification.json").then(json =>{
		

	// 	Object.keys(json.paths).forEach(function(key) {
			
	// 		if(url == key){
	// 			console.log("-----")
	// 		console.log(json.paths[key].get.parameters);
	// 			b.innerHTML = JSON.stringify(json.paths[key].get.parameters[0].description);
	// 			divToFill.appendChild(b);
	// 		}
	// 	});
	// });
    }


    //Llamada funcion con esta url
    console.log("Url: ["+url+"]");
    

    if(url!=""){

        let fullUrlReq = "";

        fullUrlReq = urlServer+"opendata"+url+"?api_key="+apiKey;
        
        console.log("Full: "+fullUrlReq);


        //Obtener datos de la url, si falla mostramos mensaje error
        getAemetUrlData(divFill, fullUrlReq).then( urlDest => {
            if(urlDest.hasOwnProperty("ok") && urlDest.ok == false){
                let err = document.createElement("p");
                err.innerHTML="No se ha conseguido obtener los datos";
                divFill.appendChild(err);
            }
        });
    }
    else{
        let err = document.createElement("p");
        err.innerHTML="No se ha conseguido obtener los datos";
        divFill.appendChild(err);

        console.log("No se ha conseguido obtener los datos");
    }
}

function modalURLs(){
    let fullUrlReq = urlServer+"AEMET_OpenData_specification.json";
    let lorem = "Lorem Ipsum es simplemente el texto\n de relleno de las imprentas "+
                "y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas 'Letraset', las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum";
    let paths_data = "";
    //let ret = getAemetUrlData(null, fullUrlReq);

    getAemetUrlData(null, fullUrlReq).then( ret => {
        let json = JSON.parse(ret);

        Object.keys(json).forEach(function(key) {
            //console.log(key);
            //paths_data = addString(paths_data,"**********************INICIO**********************");
            paths_data = addString(paths_data, "[   "+key+"   ]");

            if(json[key].get.hasOwnProperty("parameters")){
                json[key].get.parameters.forEach(function(obj) {
                    //paths_data = addString(paths_data, obj.description);
                });
                
            }
            //paths_data = addString(paths_data,"***********************FIN***********************\n");
        });

       
        // let divFill = document.getElementById("pFill");

        // let a = document.createElement("iframe");
        // a.id = "goAemetData";
        // a.src = urlDest;
        // //a.classList.add("nav__elements__a");
        // //a.innerHTML = "Go to AEMET data!";
        // divFill.appendChild(a);

        // console.log(urlDest)
        // // openInNewTab(urlDest);

        alert(paths_data);
    });
   
}

function addString(stringBuild, stringAdd){
    stringBuild = stringBuild + stringAdd + "\n";
    return stringBuild;
}
