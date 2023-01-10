/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

function errorMessageAjax(message){
    var html = '<p class="pError" >'+message+'</p>'
    $('#ajaxContent').append(html);
}

function isLoggedIn(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
           function(){
               if(xhr.readyState===4 && xhr.status === 200){
                   
               }else if (xhr.status!==200){
                   window.location.replace("AdminLoginPage.html");
               }
           }
    xhr.open("GET","AdminLogin");
    xhr.send();
    
}

function removeUser(username){
    console.log("Removing user: "+username);
    const data = {username : username};
    var jsonData = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    
    xhr.onload = 
            function(){
                if(xhr.readyState===4 && xhr.status ===200){
                    showUsers();
                    let html = "User: "+username+" has been deleted <br>" ;
                    $('#extraMessage').append(html);
                }else if(xhr.status!==200){
                    document.getElementById("ajaxContent").innerHTML = 
                            'Request Failed. Returned status' + xhr.status + "<br>";
                }
            };
    xhr.open("POST","DeleteUser?username="+username);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(jsonData);
}

function removeLibrarian(){
    console.log("Removing Librarian: "+username);
    const data = {username : username};
    var jsonData = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    
    xhr.onload = 
            function(){
                if(xhr.readyState===4 && xhr.status ===200){
                    showUsers();
                    let html = "Librarian: "+username+" has been deleted <br>" ;
                    $('#extraMessage').append(html);
                }else if(xhr.status!==200){
                    document.getElementById("ajaxContent").innerHTML = 
                            'Request Failed. Returned status' + xhr.status + "<br>";
                }
            };
    xhr.open("POST","DeleteLibrarian?username="+username);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(jsonData);
}

function createUserTable(users){ //users === json object array username, name , surname
    
    document.getElementById("ajaxContent").innerHTML = ""
    var html = "<table><tr><th>Username</th><th>First Name</th> <th>Last Name</th> <th>UserType</th> </tr>";
    var librarians = users.librarians;
    var students = users.students;

    for(i=0; i< librarians.length; i++){
        let user = librarians[i];
        html += "<tr><td>" + user.username + "</td><td>" + user.firstname+ "</td>"
            + "<td>" + user.lastname +"</td> <td>Librarian</td> <td>\n\
            <button class ='remove_btn' onClick='removeUser(\""+  user.username +"\")'> DEL </button> </td>\n\
             </tr>";

    }
    for(i=0; i<students.length; i++){
        let user = students[i];
        
        html += "<tr><td>" + user.username + "</td><td>" + user.firstname+ "</td>"
            + "<td>" + user.lastname +"</td> <td>Student</td> <td>\n\
            <button class ='remove_btn' onClick='removeUser(\""+  user.username +"\")'> DEL </button> </td>\n\
             </tr>";

    }

    html += "</table>";
    $("#ajaxContent").append(html);
}

function showUsers(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    const responseData = JSON.parse(xhr.responseText);
                    createUserTable(responseData);
                }else if(xhr.status !==200){
                    document.getElementById("ajaxContent").innerHTML =
                    'Request Failed. Returned status: ' + xhr.status + '<br>';
                    
                }
    };
    xhr.open("GET","GetAllUsers");
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
