var WeakPassword = true;
var CorrectEmail = false;
var CorrectStudentID_years=false;
var passwordsMatch = false
var canSubmit = false;
function Check_pass(){
    var pass = document.getElementById("upwd");
    var pass_confirm = document.getElementById("upwd_confirm");
    var message = document.getElementById("msg_pass_dont_match");
    if(pass.value === pass_confirm.value){
        message.innerHTML = '';
        passwordsMatch=true;
    }else{
        message.innerHTML = 'Passwords dont match!';
        canSubmit =false;
    }
}

function Show_pass(){
    if( document.getElementById("upwd").type==="text"){
        document.getElementById("upwd").type = "password";
        document.getElementById("Show_pass_but").value='Show Password';
    }else{
        document.getElementById("upwd").type = "text";
        document.getElementById("Show_pass_but").value = 'Hide Password';
    }
}



function pass_strength(){
    const forbidden_words = ['helmepa','uoc','tuc']
    var pass    = document.getElementById("upwd").value;
    var digits  = pass.replace(/[^0-9]/g,'').length;
    
    var message = document.getElementById("pass_strength_msg");
    var specialChars = "#?!@$ %^&*-"

    var unique_chars= new Set();
    var isForbidden = true

    var hasLowerCase = false;
    var hasUpperCase = false;

    function check_forbidden(value,index){
        
        return pass.toLowerCase().includes(value)
    }

    isForbidden = forbidden_words.some(check_forbidden)

    if (isForbidden) {
        message.style.color="red";
        message.innerHTML='Message cannot contain the words: '+forbidden_words;
        return
    }

    if(pass.length<8){
        message.innerHTML='';
        return;
    }


    if(digits>=pass.length/2){
        message.style.color = "red";
        message.innerHTML = 'Weak password';
        WeakPassword = true
        return;
    }

    for (let i=0; i<pass.length; i++){
        unique_chars.add(pass.charAt(i))
    }
    var unique_symbols = 0
    for (const c of unique_chars){
        if (specialChars.includes(c)){
            unique_symbols++;
        }
        if (c.toLowerCase() != c.toUpperCase()){
            
            if (c == c.toLowerCase()){
                hasLowerCase = true
            }else{
                hasUpperCase = true
            }
        }
    }


    if ( unique_symbols >=2 && hasLowerCase && hasUpperCase){
        message.style.color="green";
        message.innerHTML = 'Strong password';
        WeakPassword = false
        return
    } else{
        message.style.color = "orange";
        message.innerHTML = 'Medium password';
        WeakPassword = false
        return;
    }


}

function student_email_check(){
    if(document.getElementById("LibrarianONLY")){
        return // librarian
    }
    if(!document.getElementById("Student").checked){
        let message = document.getElementById("email_message") 
        message.innerHTML='';
        return
    }
    let message = document.getElementById("email_message") 

    let email = document.getElementById("uemail").value.toLowerCase()
    let studiesAt = document.getElementById("University").value.toLowerCase()
    
    if ( !email.endsWith(studiesAt+'.gr')){
        message.innerHTML = 'E-mail and university dont match';
        message.style.color = "red";
        CorrectEmail= false
    }else{
        message.innerHTML='';
        CorrectEmail= true
    }
}

function studentID_check(){
    if(document.getElementById("LibrarianONLY")){
        return // librarian
    }
    let types = ['Undergraduate', 'Graduate' , 'PhD']
    let years = [6,2,5]
    let message = document.getElementById("studentID_expiration_message")
    let initiation_date = document.getElementById("StudentID_initiation_date").value
    let expiration_date = document.getElementById("StudentID_expiration_date").value
    let StudentType = document.querySelector('input[name="student_type"]:checked').value;
    message.innerHTML = ""
    let years_to_finish = expiration_date - initiation_date
    if (expiration_date < initiation_date){
        message.innerHTML = "Student id expiration date must come after the initiation date"
        message.style.color = "red"
        CorrectStudentID_years=false
        canSubmit =false;
        return
        
    }

    if( StudentType == types[0]){
        if (years_to_finish > years[0]){
            message.innerHTML = "For " + types[0] + " student the max years for studies are "+years[0]
            message.style.color="red"
            CorrectStudentID_years=false    
            canSubmit =false;
            return;        
        }
    }

    if(StudentType == types[1]){
        if(years_to_finish > years[1]){
            message.innerHTML = "For " + types[1] + " student the max years for studies are "+years[1]
            message.style.color="red"
            CorrectStudentID_years=false   
            canSubmit =false;
            return;
        }
    }

    if(StudentType == types[2]){
        if(years_to_finish > years[2]){
            message.innerHTML = "For " + types[2] + " student the max years for studies are "+years[2]
            message.style.color="red"
            CorrectStudentID_years=false 
            canSubmit =false;
            return;
        }
    }
    CorrectStudentID_years=true
    

}

function student_user (){

    // remove librarian stuff
    function removeLibrarianStuff(){
        let lib_stuff = document.getElementById("LibrarianONLY")
        if(!lib_stuff)return
        lib_stuff.replaceChildren()
        lib_stuff.remove()
    }
    function addBackTheStudentStuff(){
        if(document.getElementById("StudentONLY")){
            return // no need to create something from the start again
        }
        let Address = document.getElementById("label_address")
        Address.innerHTML = "Address"
        let parent_div = document.getElementById("UserTypeDiv")
        let student_only_div = document.createElement("div")
        student_only_div.id = "StudentONLY"

        parent_div.append(student_only_div)

        let studentTypeSpan = document.createElement("span")
        studentTypeSpan.innerHTML = "Student Type: "
        student_only_div.appendChild(studentTypeSpan)
        const studentType_array = ['Undergraduate','Graduate','PhD']
        var studentInput = []
        var studentLabel = []
        for (i=0; i<3; i++){
            studentInput.push(document.createElement("input"))
            studentLabel.push(document.createElement("label"))

            studentInput[i].type = "radio"
            studentInput[i].name ="StudentType"
            studentInput[i].value=studentType_array[i]
            studentInput[i].id=studentType_array[i]
            studentInput[i].className = "StudentTypeClass"

            studentLabel[i].className="student_type_label"
            studentLabel[i].id = studentType_array[i] +"_label"
            studentLabel[i].innerHTML= studentType_array[i]
            studentLabel[i].for=studentType_array[i]
            
            student_only_div.appendChild(studentInput[i])
            student_only_div.appendChild(studentLabel[i])
        }
        studentInput[0].checked = true
        let studentID_label = document.createElement("label")
        let studentID = document.createElement("input")
        studentID.id="StudentID"
        studentID.name = "studentID"
        studentID.required=true
        studentID.pattern="[0-9]+"
        studentID.maxLength="12"
        studentID.minLength="12"
 
        studentID_label.for="StudentID"
        studentID_label.class="StudentIDlabel"
        studentID_label.innerText="Student ID number"


        let ID_StartDate = document.createElement("input")
        let ID_StartDate_label = document.createElement("label")
        ID_StartDate.id =  "StudentID_initiation_date"
        ID_StartDate.name = "StudentID_initiation_date"
        ID_StartDate.min  = "2016-01-01"
        ID_StartDate.value = "2016-01-01"
        ID_StartDate.onchange = "studentID_check()"
        ID_StartDate.type = "date"

        ID_StartDate_label.for = "StudentID_initiation_date"
        ID_StartDate_label.innerHTML = "Student Id initiation date: "

        let ID_endDate = document.createElement("input")
        let ID_endDate_label = document.createElement("label")
        ID_endDate.id = "StudentID_expiration_date"
        ID_endDate.name = "StudentID_expiration_date"
        ID_endDate.min = "2023-01-02"
        ID_endDate.value = "2023-01-02"
        ID_endDate.onchange="studentID_check()"
        ID_endDate.type = "date"

        ID_endDate_label.for ="StudentID_expiration_date"
        ID_endDate_label.innerHTML="Student Id expiration date: "
    
        let university = document.createElement("select")
        university.id = "University"
        
        unis = ['UOC','HELMEPA','TUC']
        options = []
        
        for (i=0; i<3; i++){
            options.push(document.createElement("option"))
            options[i].value=unis[i]
            options[i].innerHTML=unis[i]
            university.appendChild(options[i])
        }

        let university_label = document.createElement("label")
        university_label.for = "University"
        university_label.innerText="Student at: "
    
        let department = document.createElement("input")
        let department_label = document.createElement("label")
        department.id ="Department"
        department.name ="Department"
        department.type = "text"
        department.minLength="3"
        department.maxLength="50"

        department_label.for="Department"
        department_label.innerText="Department: "

        br = document.createElement("div")
        br.appendChild(document.createElement("br"))
        student_only_div.appendChild(br)

        student_only_div.appendChild(studentID_label)
        student_only_div.appendChild(studentID)
        student_only_div.appendChild(document.createElement("br"))
        student_only_div.appendChild(document.createElement("br"))


        student_only_div.appendChild(ID_StartDate_label)
        student_only_div.appendChild(ID_StartDate)
        student_only_div.appendChild(document.createElement("br"))
        student_only_div.appendChild(document.createElement("br"))


        student_only_div.appendChild(ID_endDate_label)
        student_only_div.appendChild(ID_endDate)
        student_only_div.appendChild(document.createElement("br"))
        student_only_div.appendChild(document.createElement("br"))


        student_only_div.appendChild(university_label)
        student_only_div.appendChild(university)
        student_only_div.appendChild(document.createElement("br"))
        student_only_div.appendChild(document.createElement("br"))
        
        student_only_div.appendChild(department_label)
        student_only_div.appendChild(department)
        student_only_div.appendChild(document.createElement("br"))
        student_only_div.appendChild(document.createElement("br"))
        

    }
    removeLibrarianStuff()
    addBackTheStudentStuff()
    
    student_email_check()
    studentID_check()
    
}

function librarian_user () {

    function removeStudentStuff(){
        let StudentOnly = document.getElementById("StudentONLY")
        if(!StudentOnly)return
        StudentOnly.replaceChildren()
        StudentOnly.remove()
        let message = document.getElementById("email_message")
        message.innerHTML="" 
        CorrectEmail=true
        CorrectStudentID_years=true
        return        
    }
    if(document.getElementById("LibrarianONLY")){
        return // no need to create something from the start again
    }
    removeStudentStuff();
    let Address = document.getElementById("label_address")
    Address.innerHTML = "Library Address"
    let userType_div = document.getElementById("UserTypeDiv");
    
    let parent_Librarian_div = document.createElement("div")
    // parent_Librarian_div.className="LibrarianONLY"
    parent_Librarian_div.id="LibrarianONLY"
    userType_div.append(parent_Librarian_div)

    let libname = document.createElement("input")
    libname.type='text'
    libname.required=true
    libname.name = "libraryname";
    let required_abbr = document.createElement("abbr")
    required_abbr.title="required"
    required_abbr.innerHTML="*"
    let span_libname = document.createElement("span")
    span_libname.innerHTML="Library Name: "
    
    
    let textarea = document.createElement("textarea")
    let node = document.createTextNode("Library information, hours open");
    textarea.id = "libraryInfo"
    textarea.name = "libraryinfo"
    textarea.required=true 
    textarea.appendChild(node)
    textarea.rows=5
    textarea.cols=60

    let br = document.createElement("div")
    br.appendChild(document.createElement("br"))

    parent_Librarian_div.appendChild(required_abbr)
    parent_Librarian_div.appendChild(span_libname)
    parent_Librarian_div.appendChild(libname)
    parent_Librarian_div.appendChild(br)
    parent_Librarian_div.appendChild(textarea)
    parent_Librarian_div.appendChild(document.createElement("br"))
    parent_Librarian_div.appendChild(document.createElement("br"))

}


function UserAgreement_check(){
    var usr_agree = document.getElementById("User_agreement");
    var message=document.getElementById("usr_agree_msg");
    if(usr_agree.checked){
        message.innerHTML = ' ';
    }else{
        message.style.color="red";
        message.style.marginLeft="15px";
        message.innerText='To continue you must agree with Terms and Conditions';
        canSubmit =false;
    }
}



function submitForm(){
    event.preventDefault();
    canSubmit =true;
    Check_pass();
    pass_strength();
    if(WeakPassword){
        alert("Password must be at least MEDIUM");
        canSubmit =false;
    }
    studentID_check();
    student_email_check();
    UserAgreement_check();
    if(canSubmit){
        RegisterPOST();
    }else{
        //alert("Cannot submit form")
    }
    
}