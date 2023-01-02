/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


function isLoggedIn(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
           function(){
               if(xhr.readyState===4 && xhr.status === 200){
                   
               }else if (xhr.status!==200){
                   window.location.replace("AdminLoginPage.html");
               }
           }
    xhr.open("GET","Login");
    xhr.send();
    
}

function removeUser(username){
    
}

function createUserTable(users){ //users === json object array username, name , surname
    var html = "<table><tr><th>Username</th><th>First Name</th> <th>Last Name</th> </tr>";
    for (const user in users) {
        
        html += "<tr><td>" + user.username + "</td><td>" + user.firstname+ "</td>"
                + "<td>" + user.lastname +"</td> <td>\n\
                <button class ='remove_btn' onClick='removeUser(user.username)'> DEL </button> </td>\n\
                 </tr>";
    }
    html += "</table>";
    return html;
}

function showUsers(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    const responseData = JSON.parse(xhr.responseText);
                }else if(xhr.status !==200){
                    
                }
    }
    xhr.open("GET","TODO_SOMETHING"); //TODO
    xhr.send();
}

function showStatistics(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    
                }else if(xhr.status !==200){
                    
                }
    }
    xhr.open("GET","TODO_SOMETHING"); //TODO
    xhr.send();
    
}