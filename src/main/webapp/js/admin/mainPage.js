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

function removeLibrarian(username){
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
            <button class ='remove_btn' onClick='removeLibrarian(\""+  user.username +"\")'> DEL </button> </td>\n\
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

function createStatisticsTable(statistics){ //users === json object array username, name , surname
    console.log(statistics);
    const booksPerCategory = statistics.booksPerCategory;
    var totalBooks = 0;
    
    for (const book in booksPerCategory) {
        totalBooks+= booksPerCategory[book];
    }
    
    document.getElementById("ajaxContent").innerHTML = ""
    var html = `<div  id=\"myChart\" style=\"width:100%; max-width:600px; height:500px;\"> </div>`;
    html+= `<div id=\"myChart2\" style=\"width:100%; max-width:600px; height:500px;\"> </div>`;
    html+= `<div id=\"myChart3\" style=\"width:100%; max-width:600px; height:500px;\"> </div>`;
    
    html += `<script>google.charts.load('current', {'packages':['corechart']});google.charts.setOnLoadCallback(drawChart);function drawChart() {
        var data = google.visualization.arrayToDataTable([`;
    
    html += `['Country', 'Mhl'],`
    for (const book in booksPerCategory) {
        
        html += `['${book}', ${booksPerCategory[book]/totalBooks * 100}],`
    }
    //['Contry', 'Mhl'],
    //['Italy',54.8],
    //['France',48.6],
    //['Spain',44.4],
    //['USA',23.9],
    //['Argentina',14.5]
    
  html += `]);`;
  
  html += `var data2 = google.visualization.arrayToDataTable([`;
    
    const booksPerLibrary = statistics.booksPerLibrary;
    var totalBooksInLibraries = 0;
    
    for (const book of booksPerLibrary) {
        
        totalBooksInLibraries += book.numberOfBooks;
    }
    
    html += `['Country', 'Mhl'],`
    for (const book of booksPerLibrary) {
        
        html += `['${book.libraryname}', ${book.numberOfBooks/totalBooksInLibraries * 100}],`
    }
//    html += `['Contry', 'Mhl'],
//    ['Italy',54.8],
//    ['France',48.6],
//    ['Spain',44.4],
//    ['USA',23.9],
//    ['Argentina',14.5]`;
    
  html += `]);`;
  
  html += `var data3 = google.visualization.arrayToDataTable([`;
    
    const numberOfStudents = statistics.numberOfStudents;
    var totalNumberOfStudents = 0;
    
    for (const book in numberOfStudents) {
        totalNumberOfStudents += numberOfStudents[book];
    }
    
    html += `['Country', 'Mhl'],`
    for (const book in numberOfStudents) {
        
        html += `['${book}', ${numberOfStudents[book]/totalNumberOfStudents * 100}],`
    }
//    html += `['Contry', 'Mhl'],
//    ['Italy',54.8],
//    ['France',48.6],
//    ['Spain',44.4],
//    ['USA',23.9],
//    ['Argentina',14.5]`;
    
  html += `]);`;

html += `var options = {
  title:'Books Per Category'
};`;
    html += `var options2 = {
  title:'Books Per Library'
};`;
    html += `var options3 = {
  title:'Number of Undergrads / Postgrads / PhD students'
};`;

  html += `var chart = new google.visualization.PieChart(document.getElementById('myChart'));
  chart.draw(data, options);
   var chart2 = new google.visualization.PieChart(document.getElementById('myChart2'));
  chart2.draw(data2, options2);
    var chart3 = new google.visualization.PieChart(document.getElementById('myChart3'));
  chart3.draw(data3, options3);
}
</script>`;
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
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const responseData = JSON.parse(xhr.responseText);
                    createStatisticsTable(responseData);
                } else if (xhr.status !==200) {
                    document.getElementById("ajaxContent").innerHTML =
                    'Request Failed. Returned status: ' + xhr.status + '<br>';
                }
    }
    xhr.open("GET","GetStatistics"); //TODO
    xhr.send();
    
}
