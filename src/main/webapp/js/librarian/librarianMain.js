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
                   window.location.replace("LibrarianLoginPage.html");
               }
           }
    xhr.open("GET","LoginLibrarian");
    xhr.send();
    
}

function create_EDITABLE_TableFromJSON(data){
    isStudent = false;
    var html="<form id='editUserData' onsubmit='updateUserData();return false;'>";
    if(data.hasOwnProperty("student_id")){
        isStudent = true;
        html += "User is Student <br> <table><tr><th>Category</th><th>Value</th></tr>"
    }else{
        html += "User is Librarian <br> <table><tr><th>Category</th><th>Value</th></tr>"
    }
    
    for (const x in data) {
        var category = x;
        var value = data[x];
        if(category === "username" || category==="student_id" || category ==="department"
                || category === "university"){
            html += "<tr><td>" + category + "</td><td>"
                    + "<input type = 'text' name ='" +category+ "' value='"+value+"' readonly>"
                    + "</td></tr>";
        }else{
            if(category === "birthdate"){
                html += "<tr><td>" + category + "</td><td>"
                    + "<input type = 'date' name ='" +category+ "' value='"+value+"'>"
                    + "</td></tr>";
            }else if(category === "telephone"){
                html += "<tr><td>" + category + "</td><td>"
                    + "<input type = 'number' name ='" +category+ "' value='"+value+"'>"
                    + "</td></tr>";
            }else if( category === "personalpage"){
                html += "<tr><td>" + category + "</td><td>"
                    + "<input type = 'url' name ='" +category+ "' value='"+value+"'>"
                    + "</td></tr>";
            }else if(category === 'lat' || category === "lon"){
                html += "<tr><td>" + category + "</td><td>"
                    + "<input type = 'number' step='any' name ='" +category+ "' value='"+value+"'>"
                    + "</td></tr>";
            }
            else{
                html += "<tr><td>" + category + "</td><td>"
                    + "<input type = 'text' name ='" +category+ "' value='"+value+"'>"
                    + "</td></tr>";
            }
            
        }
    }    
    html += "</table> <input type='submit' value='UpdateData' > </form>";
    return html; 
}

function updateUserData(){
    console.log("updating librarian");

    let myForm = document.getElementById("editUserData");
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value,key)=>(data[key]=value));
    
    var jsonData = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.readyState===4 && xhr.status === 200){
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("Your Data have been updated. Your Data: ");
            $("#ajaxContent").append(createTableFromJSON(responseData));
        }else if(xhr.status !==200){
            document.getElementById("ajaxContent").innerHTML =
                    'Request Failed. Returned status' + xhr.status + "<br>";
        }
    }
    xhr.open("POST","UpdateLibrarian"); 
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(jsonData);
}

function getDataRequest(){
    console.log("getting user data");
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState ===4 && xhr.status === 200){
                    const responseData = JSON.parse(xhr.responseText);
                    
                    $('#ajaxContent').html("<h1>Your Data</h1>");
                    $('#ajaxContent').append(create_EDITABLE_TableFromJSON(responseData));
                } else if(xhr.status !==200){
                    alert("Request failed. Status "+ xhr.status);
                }
            };
        xhr.open("GET","GetUserData");
        xhr.send();
}

function editBook(){
    
}

function isbnExists(){
    console.log("TODO");
}

function addBookToLibrary_loadForm(){
    $("#ajaxContent").load("components/AddBookForm.html");
}

function addBookToLibrary(){
    event.preventDefault();
    let bookForm = document.getElementById("addBookForm");
    let formData = new FormData(bookForm);
    const data = {};
    

    formData.forEach((value,key)=>(data[key]=value));
    
    var jsonData = JSON.stringify(data);
    console.log("adding book to library with isbn: "+ data.isbn);
    var xhr = new XMLHttpRequest();
    
    xhr.onload = 
            function(){
                if(xhr.readyState ===4 && xhr.status ===200){
                    
                
                    $('#ajaxContent').html("<span class = 'successMessage'>Book added to the library</span>");
                
                } else if(xhr.status !== 200){
                    
                    $('#ajaxContent').html("<span class = 'errorMessage'> Couldnt add book to the library</span>");
                    $('#ajaxContent').append('<br>Request Failed. Returned status: ' + xhr.status + "<br>");
                
                }
            }
        
        xhr.open("POST","AddNewBook");
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send(jsonData);
}

function getAllBorrowingRequest(){
    var xhr = new XMLHttpRequest();
    
    xhr.onload = 
            function(){
                if(xhr.readyState ===4 && xhr.status ===200){
                    console.log(xhr.responseText);
                    const responseData = JSON.parse(xhr.responseText);
                    showAllBorrowingRequest(responseData);
                } else if(xhr.status !== 200){
                    $('#ajaxContent').html("<span class = 'errorMessage'> Couldnt get Borrowing Requests</span>");
                    $('#ajaxContent').append('<br>Request Failed. Returned status: ' + xhr.status + "<br>");
                }
            }
        xhr.open("POST","GetBooksLibrary?status=requested");
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send();
}

function showAllBorrowingRequest(requests){
    // DONT FUCKING TOUCH THIS OR BIG SITUATION
    document.getElementById("ajaxContent").innerHTML = "";
    var html = "<table><tr><th>ISBN</th> <th>Borrowing_id</th> <th>Username</th><th>First Name</th> <th>Last Name</th> </tr>";
    console.log(requests);
    
    for (let i=0; i<requests.length; i++){
        let request = requests[i];
        console.log("request == "+ request);
        html += "<tr><td>"+request.isbn+" </td> <td>"+request.borrowing_id+"</td> <td>" + request.username + "</td><td>" + request.firstname+ "</td>"
            + "<td>" + request.lastname +"</td> <td>\n\
            <button class ='accept_borrow_btn' onClick='acceptBorrowingRequest(\""+  request.borrowing_id +"\")'> ACCEPT </button> </td>\n\
             </tr>";
    }
    html += "</table>";
    $("#ajaxContent").append(html);
}

function acceptBorrowingRequest(borrowing_id){
    
    var xhr = new XMLHttpRequest();
    xhr.onload =
            function(){
                if(xhr.readyState ===4 && xhr.status ===200){
                    getAllBorrowingRequest();
                    $('#ajaxContent').append("<span class = 'successMessage'>Accepted Borrow with borrow_id :"+borrowing_id+"</span>");
                    
                } else if(xhr.status !== 200){
                    $('#ajaxContent').html("<span class = 'errorMessage'> Couldnt Accept Borrowing Request</span>");
                    $('#ajaxContent').append('<br>Request Failed. Returned status: ' + xhr.status + "<br>");
                }
            }
        xhr.open("POST","ApproveABorrow?borrowing_id="+borrowing_id);
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send();
}

function updateBookStatus(isbn,status){
    
}

function showBorrowings() {
    
}

function showStatistics(){
    
}

function setBookAvailable_load(){
    $("#ajaxContent").load("components/setBookAvailable.html");
}

function setBookAvailable(){
    let isbn = document.getElementById("b_isbn").value;
    let book_status = 'available';
    console.log("Set book with isbn: "+isbn+" as available");
    
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    $("#errorAvailability").html("");
                    $("#successAvailablility").html("Book with isbn: "+isbn +" is now available");
                }else if(xhr.status !== 200){
                    $("#errorAvailability").html("Request failed. Status "+ xhr.status);
                    $("#successAvailablility").html("");
                }
        };
    xhr.open("POST","ChangeAvailabilityOfBook?isbn="+isbn+"&availability=true");
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send();
    
}

function Logout(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status ===200){
                    window.location.replace("LibrarianLoginPage.html");
                }else if(xhr.status !== 200){
                    alert("Request failed. Returned status: "+xhr.status);
                }
            };
    xhr.open('POST','Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}


