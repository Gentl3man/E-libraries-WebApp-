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

    
    $("#choices").append("<button onclick='getBorrowedBooks()' class='button' >Borrowed books</button><br>");
    $("#choices").append("<button onclick='get_BooksToReview()' class='button' >Add review</button><br>");
    
    
    $("#choices").append("<button onclick='Logout()' class='button' >Logout</button><br>");
    
    var html= `     <h3 class="notficicationH">Notifications</h3>
                    <div class=" column3Width" id="notifications" style="background-color:#ADD8E6;">
                    
                    </div>`;
    $("#notificationsParentDiv").html("");
    $("#notificationsParentDiv").append(html);
    
    
}

function addReview(){
    console.log("Adding review");
    let myForm = document.getElementById("studentBookReviewForm");
    let review = new FormData(myForm);
    
    const data = {};
    review.forEach((value,key)=>(data[key]=value));
    
    var jsonData = JSON.stringify(data);
    
    console.log("Review: "+ jsonData);
    
    var xhr = new XMLHttpRequest();
    xhr.onload =
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    $("#ajaxContent").html("<h3>Review has been added</h3>");
                }else if(xhr.status !==200){
                    $("#ajaxContent").html("<h2>Something went wrong, review cannot be added. Status: "+xhr.status+"</h2>")
                }
            };
        xhr.open("POST","CreateAReview");
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send(jsonData);
}

function show_BookReviewForm(book){
    $("#ajaxContent").html("");
   
    html =  '<form id="studentBookReviewForm" onSubmit="addReview(); return false;" method="post">'
            +'    <fieldset>'
            +'        <legend>Add Review for book: Title ISBN: "'+book.isbn+'" </legend>'
            +''
            +'        <label for="reviewTextArea">Review Comment: </label>'
            +'        <textarea id="reviewTextArea" name="reviewText" required>'
            +''
            +'        </textarea>'
            +'        <br>'
            +''
            +'        <label for="score">Book Score: </label>'
            +''
            +'       <select id="score" name="reviewScore">'
            +'          <option value="1">1   &#2605</option>'
            +'          <option value="2">2   &#2605</option>'
            +'          <option value="3">3   &#2605</option>'
            +'          <option value="4">4   &#2605</option>'
            +'          <option value="5">5   &#2605</option>'
            +'          <option value="6">6   &#2605</option>'
            +'          <option value="7">7   &#2605</option>'
            +'          <option value="8">8   &#2605</option>'
            +'          <option value="9">9   &#2605</option>'
            +'          <option value="10">10 &#2605</option>'
            +''
            +'        </select>'
            +'        <input type="hidden" value="'+book.isbn+'" name="isbn">'
            +'          <br>'
            +'        <input type="submit" value="Add review">'
            +''
            +'    </fieldset>'
            +'</form>';
//    var a = `
//    asd
//    ${book.isbn}
//    asdas
//    asdas
//
//`;
    $("#ajaxContent").html(html);
}

function show_BooksToReview(books){
    var html = "<h4>Books result</h4>";
    
    for(let i=0; i<books.length; i++){
        
        let book = books[i];
        html +=  '<div class ="book_details container-fluid">'
                +    '<div class="row">'
                +    '    <div class="col-lg-4">'
                +    '        <img class="book_image" src="'+book.photo+'" alt="Book image not found">'
                +    '    </div>'
                +    '    <div class="col-lg-5">'
                +    '        You ll find the book <a href="'+book.url+'">here</a>'
                +    '        <br>'
                +    '        <p>Title:'+ book.title+'</p><br>'
                +    '        <p>Authors: '+book.authors+'</p><br>'
                +    '        <p>Genre: '+book.genre+'</p><br>'
                +    '        <p>Pages: '+book.pages+'</p><br>'
                +    '        <p>Publication Year: '+book.publicationyear+'</p><br>'
                +    '    </div>'
                +    '<div class="col-lg-3 reviewCol">'
                +    '  <button onclick=\'show_BookReviewForm('+JSON.stringify(book)+')\'>Add a review</button>'
                +    '</div>'
                +    '</div>'
                +    '<hr>';
        
    }
    
    $("#ajaxContent").append(html);
}

function get_BooksToReview(){
    var xhr  = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                   const books = JSON.parse(xhr.responseText);
                   $('#ajaxContent').html("");
                   show_BooksToReview(books);
                }else if( xhr.status !==200){
                    $('#ajaxContent').html("Couldnt retrieve books to review! Status: "+ xhr.status);
                }
            };
        xhr.open("GET","RetrieveReviewableBorrowings?status=successEnd");
        xhr.send();
            
}

function getBorrowedBooks(){
    var xhr = new XMLHttpRequest();
    xhr.onload =
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    const borrowedBooks = JSON.parse(xhr.responseText);
                    ShowAllBorrowedBooks(borrowedBooks);
                }else if( xhr.status !==200){
                    $('#ajaxContent').html("Couldnt retrieve the books you borrowed! Status: "+xhr.status);
                }
            };
        xhr.open("GET","RetrieveReviewableBorrowings?status=borrowed");
        xhr.send();
            
}

function ShowAllBorrowedBooks(books){
    document.getElementById("ajaxContent").innerHTML="";
    var html = "<table><tr><th>ISBN</th><th>Title</th> <th>From date</th> <th>To date</th> </tr>";
    
    for(let i=0; i<books.length; i++){
        let book = books[i];
        html += "<tr><td>" + book.isbn + "</td><td>" + book.title+ "</td>"
            + "<td>" + book.fromdate +"</td> <td>"+book.todate+"</td> <td>\n\
            <button class ='return_btn' onClick='returnBook("+JSON.stringify(book)+")'> RETURN </button> </td>\n\
             </tr>";
    }
    html += "</table>";
    $("#ajaxContent").append(html);
}

function returnBook(book){
    console.log("Return book with isbn: "+book.borrowing_id);
    //here we got the book that needs to be returned, what data do i send???
    var xhr = new XMLHttpRequest();
    var isbn = book.isbn;
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    getBorrowedBooks();
                    let html ="<br>Succesfully return book with isbn: "+isbn
                    $('#ajaxContent').append(html);
                    
                }else if( xhr.status !== 200){
                    $('#ajaxContent').html("Couldnt return book! Status: "+xhr.status);
                }
            };
        xhr.open("POST","ReturnABook?borrowing_id="+book.borrowing_id);
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send();
}

function showBookForm(){
    $("#ajaxContent").load('components/searchBook.html');
}

function findBook_results(books){
    $('#ajaxContent').html("");
    var html = "<h4>Books result</h4>";
    
    for(let i=0; i<books.length; i++){
        
        let book = books[i];
        html +=  '<div class ="book_details container-fluid">'
                +    '<div class="row">'
                +    '    <div class="col-lg-3">'
                +    '        <img class="book_image" src="'+book.photo+'" alt="Book image not found">'
                +    '    </div>'
                +    '    <div class="col-lg-3">'
                +    '        You ll find the book <a href="'+book.url+'">here</a>'
                +    '        <br>'
                +    '        <p>Title:'+ book.title+'</p><br>'
                +    '        <p>Authors: '+book.authors+'</p><br>'
                +    '        <p>Genre: '+book.genre+'</p><br>'
                +    '        <p>Pages: '+book.pages+'</p><br>'
                +    '        <p>Publication Year: '+book.publicationyear+'</p><br>'
                +    '    </div>'
                +    '<div class="col-lg-6 reviewCol">'
                +    '  <h3>Reviews</h3>'
                
                
        for(let j =0; j< book.reviews.length; j++){
            let review = book.reviews[j];
            html += '<div class="row review">'
                    +'    <div class="col-lg-9 review">'
                    +'        <p>'+review.reviewText+'</p>'
                    +'    </div>'
                    +'    <div class="col-lg-3 reviewScore">'
                    +'        <p>Score: '+review.reviewScore+'</p>'
                    +'    </div>'
                    +'</div>'
                    +'<hr>';
        }
        html+=      '</div>'
                    +'</div>'
                    +'<div class="row">'
                    +'    <button onClick="libraries_nearMe_AndGoTOGetUserData(\''+book.isbn+'\')">Find it in libraries:</button>'
                    +'</div>'
                    +'<hr>';
        
    }
    
    $("#ajaxContent").append(html);
}

function findBook(){
    let myForm = document.getElementById("searchBookForm");
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value,key)=>(data[key]=value));
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.readyState===4 && xhr.status === 200){
            const responseData = JSON.parse(xhr.responseText);
            findBook_results(responseData);
        }else if(xhr.status===404){
            $("#ajaxContent").html("No book matches the creteria!");
        }else if(xhr.status !==200){
            $("#ajaxContent").html("Request Failed status: "+xhr.status);
        }
    };
    xhr.open("GET","retrievesBooks?fromYear="+ data.fromYear+"&toYear="+data.toYear+"&title="+data.title+"&author="+data.authors+"&fromPageNumber="
                                             + data.fromPageNumber + "&toPageNumber="+data.toPageNumber+"&genre="+data.genre);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send();
    
    
}

async function getUserData_andShowLibrariesNearMe(libraries,isbn){
    console.log("getting user data");
    
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState ===4 && xhr.status === 200){
                    const usrData = JSON.parse(xhr.responseText);
                    show_LibrariesNearMe(libraries,usrData,isbn);
                } else if(xhr.status !==200){
                    const usrData = {};
                    show_LibrariesNearMe(libraries,usrData,isbn);
                }
            };
        xhr.open("GET","GetUserData",false);
        xhr.send();
    
}

function show_LibrariesNearMe(libraries,usrData,isbn){
    console.log("Libraries: "+libraries);
    console.log("Libraries: "+usrData);
    var lat,lon;
    var valid_usrData;
    var ordered_libraries; //based on distance and on time to arrive with a car
    
    if(Object.keys(usrData).length !== 0){
        lat = usrData.lat;
        lon = usrData.lon;
        valid_usrData = true;
        ordered_libraries = orderLibraries(libraries,lat,lon)
    }else{
        ordered_libraries = libraries
    }
    console.log(ordered_libraries);
    
    
    document.getElementById("ajaxContent").innerHTML = ""
    var html ='<h3>Libraries where the book is available</h3><hr>';
    for (let i=0; i< ordered_libraries.length; i++){
        library = ordered_libraries[i];
        html+='  <div class="row" id="rowId'+i+'">'
           +'     <div class="col-lg-4 basiclibInfo">'
           +'         <p class="basiclibInfoP">'
           +'             library name    : '+library.libraryname+' <br>'
           +'             Library address : '+library.address+'<br>'
           +'             Library City    : '+library.city+' <br>'
           +'             Email           : '+library.email+' <br>'
           +'             Distance        : '+library.distance+' <br>'
           +'             Duration        : '+library.duration+' <br>'
           +'         </p>'
           +'     </div>'
           +'     <div class="col-lg-6 infoText">'
           +'         <p class="infoTextP">'
           +            library.libraryinfo
           +'         </p>'
           +'     </div>'
           +'     <div id="borrowDivID'+i+'" class="col-lg-2 borrowDiv">'
           +'         <button  class="borrowButton" onclick="Student_borrow(\''+library.library_id+'\' ,\''+isbn+'\',\'borrowDivID'+i+'\')">Borrow from this library</button>'
           +'         <button id="borrowBtnId'+i+'" class="showMapBtn" onclick="showLibraryOnMap(\'mapId'+i+'\' , '+library.lat+' ,'+library.lon+','+i+')">Show on map</button>'
           +'     </div>'
           +' </div>'
           + '<div id="mapId'+i+'"></div>'
           +'<hr>';
    }
    $("#ajaxContent").append(html);
    
}



function Student_borrow(library_id,isbn,divID){
    console.log("BorrowID: ",library_id);
    console.log("isbn: "+isbn);
    console.log("id: "+ divID);
    var xhr = new XMLHttpRequest();
    xhr.onload =
            function(){
                if(xhr.readyState===4 && xhr.status ===200){
                    $("#ajaxContent").html("<h2>Succesfully requested to borrow book: "+isbn+" from library: "+library_id+"</h2>")
                }else if(xhr.status !== 200){
                    document.getElementById(divID).innerHTML="Cannot borrow book from this library";
                }
            };
            
            xhr.open("POST","BorrowABook?isbn="+isbn+"&library_id="+library_id);
            xhr.setRequestHeader("Content-type","application/json");
            xhr.send();
}

function libraries_nearMe_AndGoTOGetUserData(isbn){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState ===4 && xhr.status === 200){
                    const responseData = JSON.parse(xhr.responseText);
                    getUserData_andShowLibrariesNearMe(responseData, isbn);
                } else if(xhr.status !==200){
                    $("#ajaxContent").html("Request Failed status: "+xhr.status);
                }
            };
            
            xhr.open("GET","GetBookAvailability?isbn="+isbn);
            xhr.setRequestHeader("Content-type","application/json");
            xhr.send();
}

function showBorrowBookForm(){
    $('#ajaxContent').html("<h1>Borrow a book</h1>");
    
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
                    $('#ajaxContent').html("Request failed. Status "+ xhr.status);
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
                getNotifications();
            }else if(xhr.status !== 200){
                $("#error").html("Wrong Credentials Request failed. Status: "+xhr.status);
            }
        }
        var data = $("#loginForm").serialize();
        xhr.open("POST","LoginStudent");
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
                   getNotifications();
               }else if (xhr.status!==200){
                   $("#choices").load("register_login_buttons.html");
               }
           }
    xhr.open("GET","LoginStudent");
    xhr.send();
    
}

function Logout(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status ===200){
                    $("#choices").load("register_login_buttons.html");
                    $("#ajaxContnet").html("Succesful Logout");
                    $("#notificationsParentDiv").html("");
                }else if(xhr.status !== 200){
                    alert("Request failed. Returned status: "+xhr.status);
                }
            };
    xhr.open('POST','Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showNotifications(notifications){
    console.log(notifications);
    var html = "";
    for(i=0; i< notifications.length; i++){
        let notification = notifications[i];
        html +=`<p>Book with ISBN: ${notification.isbn} needs to be returned. Return untill: ${notification.todate}</p>
                <br>
                <hr>
        `;

    }
    $("#notifications").html("");
    $("#notifications").append(html);
}

function getNotifications(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    const responseData = JSON.parse(xhr.responseText);
                    showNotifications(responseData);
                }else if(xhr.status !== 200){
                    $("#notifications").html("");
                    $("#notifications").html("Couldnt get notifications! Status: "+xhr.status);
                }
            };
    xhr.open("GET","GetBorrowingNotifications");
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

// books per category
function showDisoverBooks(books){
    console.log(books);
}

function discoverBooks(){
    var xhr = new XMLHttpRequest();
    xhr.onload = 
            function(){
                if(xhr.readyState ===4 && xhr.status ===200){
                    const responseData = JSON.parse(xhr.responseText);
                    showDisoverBooks(responseData);
                }else if(xhr.status !== 200){
                    $("#ajaxContent").html("")
                    $("#ajaxContent").html("<h3>Couldnt get books! Status: " + xhr.status+"</h3>")
                }
            }
    xhr.open("GET","DiscoverBooks");
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}