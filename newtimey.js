//Oculta banner 000webhost
function hideBanner(){
	const collection= document.getElementsByClassName("disclaimer");
    if(collection.length!=0){
        collection[0].style.display="none";    
    }
    else{ 
        $('*').each(function(){
            if($(this).css('z-index') == 9999999) {
                //$(this) - is element what you need
                
                $(this).css('display', 'none');
            }  
        })
    }
}

$('#scrollToTop').on('click',function() {
    $("html, body").animate({ scrollTop: 0 }, 1200);
  })

// Change style of navbar on scroll
window.onscroll = function() {myFunction()};

function myFunction() {
    var navbar = document.getElementById("navbar");
    var navbarResp = document.getElementById("navbar-resp");
    var logo = document.getElementById("logo");
    var logoR = document.getElementById("logo-resp");

    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "nav-color";
        navbarResp.className = "nav-resp-color";
        
    } else {
        navbar.className = navbar.className.replace("color", "transp");
        navbarResp.className = navbarResp.className.replace("color", "transp");
    }
}

function toogleBars(){
    var menuResp = document.getElementById("menu-resp");
    var navbarResp = document.getElementById("navbar-resp");
    let right = menuResp.style.right;

    if(right == "0px"){
        menuResp.style.right = "-650px";
    }
    else{
        menuResp.style.right = "0px";
    }
}