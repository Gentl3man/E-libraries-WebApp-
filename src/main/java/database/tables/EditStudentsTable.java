/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database.tables;

import mainClasses.Student;
import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author Mike
 */
public class EditStudentsTable {

    public int getStudentId(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            System.out.println(">>>>" + json);
            Gson gson = new Gson();
            Student lib = gson.fromJson(json, Student.class);
            System.out.println(lib.getUser_id());
            return lib.getUser_id();
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return 0;
    }
 
    public void addStudentFromJSON(String json) throws ClassNotFoundException{
        Student user = jsonToStudent(json);
         addNewStudent(user);
    }
    
     public Student jsonToStudent(String json){
         Gson gson = new Gson();

        Student user = gson.fromJson(json, Student.class);
        return user;
    }
    
    public String studentToJSON(Student user){
         Gson gson = new Gson();

        String json = gson.toJson(user, Student.class);
        return json;
    }
    
   
    
    public void updateStudent(String username,String personalpage) throws SQLException, ClassNotFoundException{
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update="UPDATE students SET personalpage='"+personalpage+"' WHERE username = '"+username+"'";
        stmt.executeUpdate(update);
    }
    
    public void updateStudentData(Student s) throws SQLException, ClassNotFoundException{
        
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update="UPDATE students SET personalpage='"+s.getPersonalpage()+"'"
               
                +", password='"+s.getPassword()+"'"
                +", firstname='"+s.getFirstname()+"'"
                +", lastname='"+s.getLastname()+"'"
                +", birthdate='"+s.getBirthdate()+"'"
                +", gender='"+s.getGender()+"'"
                +", country='"+s.getCountry()+"'"
                +", city='"+s.getCity()+"'"
                +", address='"+s.getAddress()+"'"
                +", lat='"+s.getLat()+"'"
                +", lon='"+s.getLon()+"'"
                +", telephone='"+s.getTelephone()+"'"
                
                +" WHERE username = '"+s.getUsername()+"'";
        stmt.executeUpdate(update);
    }
    
    public void printStudentDetails(String username, String password) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username + "' AND password='"+password+"'");
            while (rs.next()) {
                System.out.println("===Result===");
                DB_Connection.printResults(rs);
            }

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }
    
    public Student databaseToStudent(String username, String password) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username + "' AND password='"+password+"'");
            System.out.println("SELECT * FROM students WHERE username = '" + username + "' AND password='"+password+"'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }
    
    public String databaseStudentToJSON(String username, String password) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username + "' AND password='"+password+"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            return json;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }
    
    public Student databaseStudent_CheckID_username_email(String username, String student_id, String email) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try{
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username + "' OR student_id='"+student_id+"OR email="+email+"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        }catch(Exception e){
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public Student DatabaseStudentExists(String username, String email)throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try{
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username +"OR email="+email+"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        }catch(Exception e){
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
        
    }
    
    public Student StudentUserNameExists(String username)throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try{
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username +"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        }catch(Exception e){
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
        
    }
    
    public Student StudentEmailExists(String email)throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try{
            rs = stmt.executeQuery("SELECT * FROM students WHERE email = '" + email +"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        }catch(Exception e){
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
        
    }
    
    public Student Student_IdExists(String student_id)throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try{
            rs = stmt.executeQuery("SELECT * FROM students WHERE student_id = '" + student_id +"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        }catch(Exception e){
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
        
    }
    
     public void createStudentsTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE students "
                + "(user_id INTEGER not NULL AUTO_INCREMENT, "
                + "    username VARCHAR(30) not null unique,"
                + "    email VARCHAR(200) not null unique,	"
                + "    password VARCHAR(32) not null,"
                + "    firstname VARCHAR(30) not null,"
                + "    lastname VARCHAR(30) not null,"
                + "    birthdate DATE not null,"
                + "    gender  VARCHAR (7) not null,"
                + "    country VARCHAR(30) not null,"
                + "    city VARCHAR(50) not null,"
                + "    address VARCHAR(50) not null,"
                + "    student_type VARCHAR(50) not null,"
                + "    student_id VARCHAR(14) not null unique,"
                + "    student_id_from_date DATE not null,"
                + "    student_id_to_date DATE not null,"
                + "   university VARCHAR(50) not null,"
                + "   department VARCHAR(50) not null,"
                + "    lat DOUBLE,"
                + "    lon DOUBLE,"
                + "    telephone VARCHAR(14),"
                + "   personalpage VARCHAR(200),"
                + " PRIMARY KEY ( user_id))";
        stmt.execute(query);
        stmt.close();
    }

    public JSONArray retrieveStudents() throws ClassNotFoundException, SQLException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students");
            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                JSONObject json = new JSONObject();
                json.put("username", rs.getString("username"));
                json.put("firstname", rs.getString("firstname"));
                json.put("lastname", rs.getString("lastname"));
                jsonArray.put(json);
            }
            return jsonArray;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void deleteStudent(String username) throws ClassNotFoundException, SQLException {
        Connection con = DB_Connection.getConnection();

        String query = "DELETE FROM students WHERE username = ?";
        PreparedStatement preparedStmt = con.prepareStatement(query);
        preparedStmt.setString(1, username);
        preparedStmt.execute();
        con.close();
    }
    
    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void addNewStudent(Student user) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " students (username,email,password,firstname,lastname,birthdate,gender,country,city,address,student_type,"
                    + "student_id,student_id_from_date,student_id_to_date,university,department,lat,lon,telephone,personalpage)"
                    + " VALUES ("
                    + "'" + user.getUsername() + "',"
                    + "'" + user.getEmail() + "',"
                    + "'" + user.getPassword() + "',"
                    + "'" + user.getFirstname() + "',"
                    + "'" + user.getLastname() + "',"
                    + "'" + user.getBirthdate() + "',"
                    + "'" + user.getGender() + "',"
                    + "'" + user.getCountry() + "',"
                    + "'" + user.getCity() + "',"
                    + "'" + user.getAddress() + "',"
                    + "'" + user.getStudent_type() + "',"
                    + "'" + user.getStudent_id() + "',"
                    + "'" + user.getStudent_id_from_date() + "',"
                    + "'" + user.getStudent_id_to_date()+ "',"
                    + "'" + user.getUniversity() + "',"
                    + "'" + user.getDepartment() + "',"
                    + "'" + user.getLat() + "',"
                    + "'" + user.getLon() + "',"
                    + "'" + user.getTelephone() + "',"
                    + "'" + user.getPersonalpage()+ "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The user was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditStudentsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public JSONObject getStudentsPerStudentType() throws ClassNotFoundException, SQLException {
        JSONObject json = new JSONObject();

        Connection con = DB_Connection.getConnection();
        String query = "SELECT COUNT(*) AS rowcount FROM students WHERE student_type = ?";
        PreparedStatement preparedStmt = con.prepareStatement(query);
        preparedStmt.setString(1, "PhD");
        ResultSet rs = preparedStmt.executeQuery();

        if (rs.next()) {
            json.put("PhD", rs.getInt("rowcount"));
        }
        con.close();

        //MasterDegree
        Connection con2 = DB_Connection.getConnection();
        String query2 = "SELECT COUNT(*) AS rowcount FROM students WHERE student_type = ?";
        PreparedStatement preparedStmt2 = con2.prepareStatement(query2);
        preparedStmt2.setString(1, "MasterDegree");
        ResultSet rs2 = preparedStmt2.executeQuery();

        if (rs2.next()) {
            json.put("MasterDegree", rs2.getInt("rowcount"));
        }
        con2.close();

        Connection con1 = DB_Connection.getConnection();
        String query1 = "SELECT COUNT(*) AS rowcount FROM students WHERE student_type = ?";
        PreparedStatement preparedStmt1 = con1.prepareStatement(query1);
        preparedStmt1.setString(1, "BSc");
        ResultSet rs1 = preparedStmt1.executeQuery();

        if (rs1.next()) {
            json.put("BSc", rs1.getInt("rowcount"));
        }
        con1.close();
        return json;
    }

}
