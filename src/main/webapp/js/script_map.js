
//Map stuff hurray 

//location data
var country;
var city;
var address;
var last_valid_lon = 1;
var last_valid_lat = 2;
var auto_complete_lon =1;
var auto_complete_lat= 2;
var wait_time_until_done=0;
var location_exists = false;
var map_showing
var isCrete = false

var carDistances;


function get_location(){

    if(document.getElementById("city").value.length==0 || document.getElementById("address").value.length==0){
        console.log("Not enough data for location");
        wait_time_until_done =0;
        location_exists= false;
        return -27;
    }

    var message = document.getElementById("Location_doesnt_exitst_msg");
    //arxikopoihsh
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    //Ti kanw me data otan ftasoun
    xhr.addEventListener("readystatechange", function () {
	    if (this.readyState === this.DONE) {
            console.log("Response: "+this.responseText);
            var response = JSON.parse(this.responseText);
            if(Object.keys(response).length===0){
                // console.log('Location doesnt exist');
                message.style.marginLeft="15px";
                message.style.color = "red";
                message.innerHTML = 'Location doesnt exist';
                
                wait_time_until_done=0;
                location_exists= false;
                hide_map();
                return -27;
            }else{
                wait_time_until_done = 0;
                console.log('Display name: ',response[0].display_name); //reminder to apo8hkeuei se pinaka
                message.innerHTML = '';
                isCrete=true
            }

            if(!response[0].display_name.includes('Crete')){
                message.style.color = "red";
                message.innerHTML = 'Service is only available for Crete for now.';
                isCrete=false
            }
            last_valid_lat = response[0].lat;
            last_valid_lon = response[0].lon;
            
            document.getElementById("hidden_lat").value=response[0].lat;
            document.getElementById("hidden_lon").value=response[0].lon;

            
            console.log('lon get ',response[0].lon);
            console.log('lat get ',response[0].lat);
            wait_time_until_done=0;
            location_exists=true;
            if(document.getElementById("Map")){
                hide_map();
                Show_onMap();
            }
            return 1790;
	    }
    });

    //my input, aka ta stoixeia poy edwse o xrhsths
    country  = document.getElementById("ucountry").value;
    city     = document.getElementById("city").value; 
    address = document.getElementById("address").value;
    var req_address = city+" "+address+" "+country;

    //request
    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q="+req_address+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "a4a103e023msh19a79de23e8f07bp1b0e2bjsnc05993904ebf");

    xhr.send(data);
    
   
}



function handler(position, message){
    var popup = new OpenLayers.Popup.FramedCloud("Popup", 
        position, null,
        message, null,
        true // <-- true if we want a close (X) button, false otherwise
    );
    map.addPopup(popup);
    

}

 function Show_onMap(){
    if(!isCrete)return
    var show_map_butt = document.getElementById("show_map");
    if(show_map_butt.value==='Hide map'){
        hide_map();
        return;
    }

    if(!location_exists){
         get_location();
        setTimeout(3000);
    }
    if(!location_exists){
        return;
    }
    var element = document.getElementById("fieldset");
    var map_div = document.createElement("div");
    map_div.id="Map";
    map_div.style="height:400px; width:490px"
    console.log("Map\'s DIV created");


    element.insertBefore(map_div,show_map_butt);

    show_map_butt.value='Hide map';


    var map = new OpenLayers.Map("Map");
    var mapnik         = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    //setposition
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position       = new OpenLayers.LonLat(last_valid_lon, last_valid_lat).transform( fromProjection, toProjection);

    //Markers	
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    //Protos Marker	
	//var position=setPosition(35.3053121,25.0722869);
	var mar=new OpenLayers.Marker(position);
	markers.addMarker(mar);	
	mar.events.register('mousedown', mar, function(evt) { 
		handler(position,'You are here');}
	);

    //Orismos zoom	
	const zoom           = 12;
    map.setCenter(position, zoom);

}


function hide_map(){
    document.getElementById("show_map").value='Show location on the map';
    if(document.getElementById("Map"))document.getElementById("Map").remove();
    return;
}

function Geoloc_getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(AutoComplete_getlocation);
    }
}

function check_geoloc(){
    
    if(!navigator.geolocation){
        document.getElementById("auto_complete_location").remove();
    }else{
        console.log("Browser supports geolocation");
    }
}

function AutoComplete_getlocation(location){
    hide_map();
    var message = document.getElementById("Location_doesnt_exitst_msg");

    last_valid_lat = location.coords.latitude;
    last_valid_lon = location.coords.longitude;
    var message = document.getElementById("Location_doesnt_exitst_msg");

    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
        console.log(this.responseText);
        var response = JSON.parse(this.responseText);
        if(Object.keys(response).length===0){
            console.log("location Doesnt exists");
            message.style.marginLeft="15px";
            message.style.color = "red";
            message.innerHTML = 'Cant figure location automaticly';
            return;
        }else{
            message.innerHTML = '';
        }
        city = response.address.city;
        address ='';
        address = response.address.postcode;
        country = response.address.country;

        console.log('lat',last_valid_lat);
        console.log('lon',last_valid_lon);
        document.getElementById("ucountry").value = country;
        document.getElementById("city").value =     city;
        document.getElementById("address").value =address; 
        get_location();
	}
    });

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat="+last_valid_lat+"&lon="+last_valid_lon+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "a4a103e023msh19a79de23e8f07bp1b0e2bjsnc05993904ebf");

    xhr.send(data);
}

//etoimh apo to geeks for geeks NOT USED
function distance(lat1,
                     lat2, lon1, lon2){

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
             + Math.cos(lat1) * Math.cos(lat2)
             * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return(c * r);
}
    
//function distance_time_with_car(originLat,originLon,destinations){
//    const data = null;
//    const xhr = new XMLHttpRequest();
//    xhr.withCredentials = true;
//    xhr.addEventListener = ("readystatechange", function(){
//        if(this.reaadyState === this.DONE){
//            console.log(this.responseText);
//            return this.responseText;
//        }
//        if(xhr.status !== 200){
//            console.log("Not 200 why tho?")
//        }
//    });
//    xhr.open("GET",
//    "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins="+originLat+"%2C"+originLon  +destinations);
//    xhr.setRequestHeader("X-RapidAPI-Key", "a4a103e023msh19a79de23e8f07bp1b0e2bjsnc05993904ebf");
//    xhr.setRequestHeader("X-RapidAPI-Host", "trueway-matrix.p.rapidapi.com");
//    xhr.send(data);
//    
//}

// DO NOT TOUCH THIS
function distance_time_with_car2(originLat,originLon,destinations){
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                    console.log(this.responseText);
                    carDistances =  JSON.parse(this.responseText);
                    
            }
    });

    xhr.open("GET", "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins="+destinations,false);
    xhr.setRequestHeader("X-RapidAPI-Key", "a4a103e023msh19a79de23e8f07bp1b0e2bjsnc05993904ebf");
    xhr.setRequestHeader("X-RapidAPI-Host", "trueway-matrix.p.rapidapi.com");

    xhr.send(data);
}



function orderLibraries(libraries,usrLat,usrLon){
    var orderedLibraries;
//    var destinations = '&destinations='
    var destinations = ''+usrLat + '%2C' + usrLon + '%3B&destinations='
    for(let i = 0; i<libraries.length; i++){
        let lat = libraries[i].lat;
        let lon = libraries[i].lon;
        destinations+=lat + "%2C" + lon +"%3B"
    }
    destinations = destinations.substring(0,destinations.length-3) // remove the last "+" (%3B)
    
//    distance_time_with_car2(usrLat,usrLon,destinations);
    
    distance_time_with_car2(usrLat,usrLon,destinations);
    var something  = carDistances;
    for(let i =0 ; i<libraries.length; i++){
        libraries[i].distance = carDistances.distances[0][i];
        libraries[i].duration = carDistances.durations[0][i];
    }
    
    orderedLibraries = libraries.sort((lib1,lib2)=>{
        if(lib1.distance === lib2.distance){
            return lib1.duration - lib2.duration;
        }
        return lib1.distance-lib2.distance;
    });
    console.log(orderedLibraries);
    return orderedLibraries;
}

function hide_library_map(mapId,i){
    document.getElementById("borrowBtnId"+i).value = "Show on map";
    if(document.getElementById("Map"+mapId))document.getElementById("Map"+mapId);
    return;
}

function showLibraryOnMap(mapId,lib_lat,lib_lon,i){

    
    var element = document.getElementById("borrowDivID"+i);
    var show_map_butt = document.getElementById("borrowBtnId"+i);
    
    if(show_map_butt.value === 'Hide map'){
        hide_library_map(mapId,i);
    }
    
    var map_div=document.createElement("div");
    map_div.id="Map"+mapId;
    map_div.style = "height:200px; width:350px;";
    
    console.log("map div created");
    
    element.insertBefore(map_div,show_map_butt);
    
    show_map_butt.value ='Hide map';
    
    var map = new OpenLayers.Map("Map"+mapId);
    var mapnik         = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    //setposition
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position       = new OpenLayers.LonLat(lib_lon, lib_lat).transform( fromProjection, toProjection);

    //Markers	
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    //Protos Marker	
	//var position=setPosition(35.3053121,25.0722869);
	var mar=new OpenLayers.Marker(position);
	markers.addMarker(mar);	
	mar.events.register('mousedown', mar, function(evt) { 
		handler(position,'You are here');}
	);

    //Orismos zoom	
	const zoom           = 12;
    map.setCenter(position, zoom);
    
    
}