var userNameExists_var = false;
var emailExists_var = false;
var student_idExists_var = false;
var isStudent = false;


function createTableFromJSON(data){
     var html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table>";
    return html;
}

function createBOOKTableFromJSON(books){
    var html = "Books Table <br>";
    html += "<table><tr>";
    for(key in books[0].keys){
        console.log(key);
        html += "<th>" + key + "</th>"
    }
    html+= "</tr>";
    
    for (let i =0; i<books.length; i++){
        html += "<tr>"
        for (const x in books[i]){
            var attribute = x;
            var value = books[i][x];
            html+="<td>"+value+"</td>"
        }
        html+="</tr>";
    }
    html += "</table>";
    return html;
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
            if(category === "birthdate" || category === "student_id_from_date" || category ==="student_id_to_date"){
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
    console.log("Updating user data");
    let myForm = document.getElementById("editUserData");
    let formData = new FormData(myForm);
    if (formData.has("student_id")){
        updateStudent();
    }else{
        updateLibrarian();
    }
    
}

function updateStudent(){
    console.log("updating student");
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
    xhr.open("POST","UpdateStudent");
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(jsonData);
}

function updateLibrarian(){
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

function RegisterPOST(){
    console.log("Seding the request");
    let myForm = document.getElementById("RegistrationForm");
    let formData = new FormData(myForm);
    
    if(!formData.has("utype")){
        document.getElementById('ajaxContent').innerHTML=
        "Request Failed.<br>";
        return;
    }else{
        if (formData.get("utype") === "Student"){
            formData.delete("utype");
            return RegisterStudentPOST(formData);
        }
        if(formData.get("utype")==="Vivlio8hkarios"){
            formData.delete("utype");
            return RegisterLibriarianPOST(formData);
        }
        // 8ewrhtika dn ftanei pote edw alla pote dn 3es right?
        document.getElementById('ajaxContent').innerHTML=
        "Request Failed.<br>";
        return;
        
    }
    

}

function RegisterLibriarianPOST(formData){
    const data ={};
    formData.forEach((value,key)=>(data[key]=value));
    var jsonData = JSON.stringify(data);
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.readyState===4 && xhr.status === 200){
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("Succesful Registration. Now please log in <br> Your Data: ");
            $("#ajaxContent").append(createTableFromJSON(responseData));
        }else if(xhr.status !==200){
            document.getElementById("ajaxContent").innerHTML =
                    'Request Failed. Returned status' + xhr.status + "<br>";
        }
    }
    xhr.open("POST","RegisterLibrarian");
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(jsonData);
}

function RegisterStudentPOST(formData){
    const data ={};
    formData.forEach((value,key)=>(data[key]=value));
    var jsonData = JSON.stringify(data);
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.readyState===4 && xhr.status === 200){
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').html("Succesful Registration. Now please log in <br> Your Data: ");
            $("#ajaxContent").append(createTableFromJSON(responseData));
        }else if(xhr.status !==200){
            document.getElementById("ajaxContent").innerHTML =
                    'Request Failed. Returned status' + xhr.status + "<br>";
        }
    }
    xhr.open("POST","RegisterStudent");
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(jsonData);
}

function userNameExists(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
        function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                $("#errorUsername").html("Username Exists");
                userNameExists_var = true;
            
            }else if (xhr.status !== 200){
                $("#errorUsername").html("");
                userNameExists_var = false;
            }
        }
        var data = $("#uname").serialize();
        xhr.open("GET", "GetUsername?"+data);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send();
}

function emailExists(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
        function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                $("#errorEmail").html("Email is being used");
                emailExists_var = true;
            
            }else if (xhr.status !== 200){
                $("#errorEmail").html("");
                emailExists_var = false;
            }
        }
        var data = $("#uemail").serialize();
        xhr.open("GET", "GetUserEmail?"+data);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send();
}

function student_idExists(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
        function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                $("#studentID_error").html("Student_id is being used");
                student_idExists_var =true;
                
            }else if (xhr.status !== 200){
                $("#studentID_error").html("");
                student_idExists_var = false;
            }
        }
        var data = $("#StudentID").serialize();
        xhr.open("GET", "GetStudentID?"+data);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send();
        
}

function setChoicesForRegisteredUser(){

}



function setChoicesForLoggedUser(){
    $("#choices").html("");
    $("#choices").append("<h1>choices</h1>");
    $("#choices").append("<button onclick='getDataRequest()' class='button' >See Your Data</button><br>");
    $("#choices").append("<button onclick='getBookList()' class='button' >Show Book list</button><br>");
    $("#choices").append("<button onclick='showBookForm()' class='button' >Find Book</button><br>");
    $("#choices").append("<button onclick='libraries_nearMe()' class='button' >Libraries near me</button><br>");
    $("#choices").append("<button onclick='borrowBook()' class='button' >Borrow Book</button><br>");
    $("#choices").append("<button onclick='addReview()' class='button' >Review Book</button><br>");

    
    
    $("#choices").append("<button onclick='Logout()' class='button' >Logout</button><br>");
    
}

function showBookForm(){
    $("#ajaxContent").load('components/searchBook.html');
}

function findBook_results(books){
    $('#ajaxContent').html("");
    var html = "<h1>Books result</h1>";
    
    for(book in books){
        html +=  '<div class ="book_details container-fluid">'
                +    '<div class="row">'
                +    '    <div class="col-lg-4">'
                +    '        <img src="'+book.photo+'" alt="Book image not found">'
                +    '    </div>'
                +    '    <div class="col-lg-8">'
                +    '        You ll find the book <a href="'+book.url+'">here</a>'
                +    '        <br>'
                +    '        <p>Title:'+ book.title+'</p><br>'
                +    '        <p>Authors: '+book.authors+'</p><br>'
                +    '        <p>Genre: '+book.genre+'</p><br>'
                +    '        <p>Pages: '+book.pages+'</p><br>'
                +    '        <p>Publication Year: '+book.publicationyear+'</p><br>'
                +    '    </div>'
                +    '</div>'
                +    '<div class="row">'
                +    '        <h3>Reviews</h3>';
        for(review in book.review){
            html += '<div class="row">'
                    +'    <div class="col-lg-10 review">'
                    +'        <p>'+review.reviewText+'</p>'
                    +'    </div>'
                    +'    <div class="col-lg-2 score">'
                    +'        <p>'+review.score+'</p>'
                    +'    </div>'
                    +'</div>'
        }
        html+=      '</div>'
                    +'<div class="row">'
                    +'    <button onClick="libraries_nearMe(book)">Find it in libraries:</button>'
                    +'</div>'
                    +'</div>'
        
    }
    
    $("#ajaxContent").append(html);
}

function findBook(){
    let myForm = document.getElementById("searchBookForm");
    let formData = new FormData(myForm);
    formData.forEach((value,key)=>(data[key]=value));
    var jsonData = JSON.stringify(data);
    
    for(x in data){
        if(x===""){
            
        }
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.readyState===4 && xhr.status === 200){
            const responseData = JSON.parse(xhr.responseText);
            findBook_results(responseData);
        }else if(xhr.status !==200){
            
        }
    }
    xhr.open("POST","TODO_BOOK");
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(jsonData);
    
    
}

function libraries_nearMe(book){
    // Show libraries when the book is available
    
}

function borrowBook(){
    
}

function addReview(){
    
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

function getBookList(){
    console.log("gettingbooks");
    var xhr = new XMLHttpRequest();
    xhr.onload =
            function(){
                if(xhr.readyState===4 &&xhr.status==200){
                    const responseData = JSON.parse(xhr.responseText);
                    $('#ajaxContent').html("<h1>Your Data</h1>");
                    $('#ajaxContent').append(createBOOKTableFromJSON(responseData));
                }else if(xhr.status !==200){
                    alert("Request failed. Status "+ xhr.status);
                }
            };
            xhr.open("GET","GetBooks");
            xhr.send();
}

function loginPOST(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
        function(){
            if(xhr.readyState===4 && xhr.status ===200){
                setChoicesForLoggedUser();
                $("#ajaxContent").html("Succesful Login");
            }else if(xhr.status !== 200){
                $("#error").html("Wrong Credentials Request failed. Status: "+xhr.status);
            }
        }
        var data = $("#loginForm").serialize();
        xhr.open("POST","Login");
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send(data);
}

function showRegistrationForm(){
    $('#ajaxContent').load("RegisterStudent.html");
}

function showLogin(){
    $("#ajaxContent").load("LoginForm.html");
}

function isLoggedIn(){
//    $("#choices").load("register_login_buttons.html");
    var xhr = new XMLHttpRequest();
    xhr.onload = 
           function(){
               if(xhr.readyState===4 && xhr.status === 200){
                   setChoicesForLoggedUser();
                   $("#ajaxContent").html("Welcome again "+xhr.responseText);
               }else if (xhr.status!==200){
                   $("#choices").load("register_login_buttons.html");
               }
           }
    xhr.open("GET","Login");
    xhr.send();
    
}

function Logout(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status ===200){
                    $("#choices").load("register_login_buttons.html");
                    $("#ajaxContnet").html("Succesful Logout");
                }else if(xhr.status !== 200){
                    alert("Request failed. Returned status: "+xhr.status);
                }
            };
    xhr.open('POST','Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}
