/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


function loginPOST(){
//    var xhr = new XMLHttpRequest();
//    xhr.onload = 
//        function(){
//            if(xhr.readyState===4 && xhr.status ===200){
//                setChoicesForLoggedUser();
//                $("#ajaxContent").html("Succesful Login");
//                $("#error").html("");
//            }else if(xhr.status !== 200){
//                $("#ajaxContent").html("");
//                $("#error").html("Wrong Credentials Request failed. Status: "+xhr.status);
//            }
//        }
//        var data = $("#loginForm").serialize();
//        xhr.open("POST","Login");
//        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
//        xhr.send(data);
}

function isLoggedIn(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
           function(){
               if(xhr.readyState===4 && xhr.status === 200){
                   window.location.replace("AdminMainPage.html")
               }
           }
    xhr.open("GET","Login"); //NOTE:maybe admin login 
    xhr.send();
//    
}
