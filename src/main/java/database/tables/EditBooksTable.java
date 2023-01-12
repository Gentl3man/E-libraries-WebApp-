/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database.tables;

import mainClasses.Book;
import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author Mike
 */
public class EditBooksTable {

    public JSONObject getBooksPerCategory() throws ClassNotFoundException, SQLException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            String query = "SELECT * FROM books GROUP BY genre";
            rs = stmt.executeQuery(query);
            JSONObject jsonObject = new JSONObject();
            while (rs.next()) {
                String jsonResult = DB_Connection.getResultsToJSON(rs);
                //System.out.println(jsonResult);

                JSONObject json = new JSONObject(jsonResult);
                String genre = json.getString("genre");

                //Count how many book on this genre exist
                Connection con1 = DB_Connection.getConnection();

                PreparedStatement ps1;
                ps1 = con1.prepareStatement("SELECT COUNT(*) AS rowcount FROM books WHERE genre = '" + genre + "'");

                ResultSet rs1 = ps1.executeQuery();

                if (rs1.next()) {
                    int count = rs1.getInt("rowcount");
                    jsonObject.put(genre, count);
                }
                con1.close();

            }
            return jsonObject;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public JSONArray getLibrariesForABook(String isbn) throws ClassNotFoundException, SQLException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            String query = "SELECT * FROM librarians JOIN booksinlibraries ON librarians.library_id=booksinlibraries.library_id WHERE booksinlibraries.isbn='" + isbn + "' AND booksinlibraries.available='true'";
            rs = stmt.executeQuery(query);
            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                String jsonResult = DB_Connection.getResultsToJSON(rs);
                //System.out.println(jsonResult);
                JSONObject json = new JSONObject(jsonResult);
                jsonArray.put(json);
            }
            return jsonArray;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public JSONArray retrievesBooks(String fromYear, String toYear, String title, String author, String fromPageNumber, String toPageNumber, String genre) throws ClassNotFoundException, SQLException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            String query = "SELECT * FROM books";
            boolean whereAdded = false;
            //////////// fromYear
            if (fromYear != null && fromYear != "") {
                whereAdded = true;
                query += " WHERE publicationyear >= '" + fromYear + "'";
            }
            /////////// toYear
            if (toYear != null && toYear != "") {
                if (whereAdded) {
                    query += " AND publicationyear <= '" + toYear + "'";
                } else {
                    whereAdded = true;
                    query += " WHERE publicationyear <= '" + toYear + "'";
                }
            }
            /////////// title
            if (title != null && title != "") {
                if (whereAdded) {
                    query += " AND title LIKE '%" + title + "%'";
                } else {
                    whereAdded = true;
                    query += " WHERE title LIKE '%" + title + "%'";
                }
            }
            /////////// author
            if (author != null && author != "") {
                if (whereAdded) {
                    query += " AND authors LIKE '%" + author + "%'";
                } else {
                    whereAdded = true;
                    query += " WHERE authors LIKE '%" + author + "%'";
                }
            }
            /////////// fromPageNumber
            if (fromPageNumber != null && fromPageNumber != "") {
                if (whereAdded) {
                    query += " AND pages >= '" + fromPageNumber + "'";
                } else {
                    whereAdded = true;
                    query += " WHERE pages >= '" + fromPageNumber + "'";
                }
            }
            /////////// toPageNumber
            if (toPageNumber != null && toPageNumber != "") {
                if (whereAdded) {
                    query += " AND pages <= '" + toPageNumber + "'";
                } else {
                    whereAdded = true;
                    query += " WHERE pages <= '" + toPageNumber + "'";
                }
            }
            if (genre != null && genre != "") {
                if (whereAdded) {
                    query += " AND genre = '" + genre + "'";
                } else {
                    whereAdded = true;
                    query += " WHERE genre = '" + genre + "'";
                }
            }
            rs = stmt.executeQuery(query);
            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                String jsonResult = DB_Connection.getResultsToJSON(rs);
                //System.out.println(jsonResult);
                JSONObject json = new JSONObject(jsonResult);

                //Add the reviews
                Connection con2 = DB_Connection.getConnection();
                Statement stmt2 = con2.createStatement();
                ResultSet rs2;
                String query2 = "SELECT * FROM reviews WHERE isbn = '" + json.getString("isbn") + "'";
                rs2 = stmt2.executeQuery(query2);
                //create the array attach it to the object
                JSONArray jsonReviewsArray = new JSONArray();
                while (rs2.next()) {
                    String review = DB_Connection.getResultsToJSON(rs2);
                    JSONObject jsonREview = new JSONObject(review);
                    jsonReviewsArray.put(jsonREview);
                }
                json.put("reviews", jsonReviewsArray);
                jsonArray.put(json);
            }
            System.out.println(jsonArray);
            return jsonArray;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void addNewBook(Book book) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " books (isbn, title, authors, genre, pages, publicationyear, url, photo)"
                    + " VALUES ("
                    + "'" + book.getIsbn() + "',"
                    + "'" + book.getTitle() + "',"
                    + "'" + book.getAuthors() + "',"
                    + "'" + book.getGenre() + "',"
                    + "'" + book.getPages() + "',"
                    + "'" + book.getPublicationyear() + "',"
                    + "'" + book.getUrl() + "',"
                    + "'" + book.getPhoto() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The book was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditStudentsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void updateBookData(Book book) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE books SET title='" + book.getTitle() + "'"
                + ",authors='" + book.getAuthors() + "'"
                + ",genre='" + book.getGenre() + "'"
                + ",pages='" + book.getPages() + "'"
                + ",publicationyear='" + book.getPublicationyear() + "'"
                + ",url='" + book.getUrl() + "'"
                + ",photo='" + book.getPhoto() + "'"
                + " WHERE isbn = '" + book.getIsbn() + "'";
        stmt.executeUpdate(update);
    }

    public Book databaseBook_Check_ISBN(String isbn) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM books WHERE isbn = '" + isbn + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Book book = gson.fromJson(json, Book.class);
            return book;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void addBookFromJSON(String json) throws ClassNotFoundException {
        Book bt = jsonToBook(json);
        createNewBook(bt);
    }

    public Book jsonToBook(String json) {
        Gson gson = new Gson();
        Book btest = gson.fromJson(json, Book.class);
        return btest;
    }

    public String bookToJSON(Book bt) {
        Gson gson = new Gson();

        String json = gson.toJson(bt, Book.class);
        return json;
    }

    public ArrayList<Book> databaseToBooks() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Book> books = new ArrayList<Book>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM books");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Book book = gson.fromJson(json, Book.class);
                books.add(book);
            }
            return books;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public JSONArray databaseToBooksStatus(String status, int library_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            String query = "SELECT * FROM borrowing JOIN students ON borrowing.user_id=students.user_id JOIN booksinlibraries ON booksinlibraries.bookcopy_id=borrowing.bookcopy_id WHERE borrowing.status = '" + status + "' AND booksinlibraries.library_id='" + library_id + "'";
            rs = stmt.executeQuery(query);
            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                String jsonResult = DB_Connection.getResultsToJSON(rs);
                //System.out.println(jsonResult);
                JSONObject json = new JSONObject(jsonResult);
                jsonArray.put(json);
            }
            return jsonArray;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Book> databaseToBooks(String genre) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Book> books = new ArrayList<Book>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM books WHERE genre= '" + genre + "'");
           
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Book book = gson.fromJson(json, Book.class);
                books.add(book);
            }
            return books;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void updateBook(String isbn, String url) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        Book bt = new Book();

        String update = "UPDATE books SET url='" + url + "'" + "WHERE isbn = '" + isbn + "'";
        //stmt.executeUpdate(update);
    }

    public void deleteBook(String isbn) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM books WHERE isbn='" + isbn + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }

    public void createBooksTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE books "
                + "(isbn VARCHAR(13) not NULL, "
                + "title VARCHAR(500) not null,"
                + "authors VARCHAR(500)  not null, "
                + "genre VARCHAR(500)  not null, "
                + "pages INTEGER not null , "
                + "publicationyear INTEGER not null , "
                + "url VARCHAR (500), "
                + "photo VARCHAR (500), "
                + "PRIMARY KEY ( isbn ))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void createNewBook(Book bt) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " books (isbn,title,authors,genre,pages,publicationyear,url,photo) "
                    + " VALUES ("
                    + "'" + bt.getIsbn() + "',"
                    + "'" + bt.getTitle() + "',"
                    + "'" + bt.getAuthors() + "',"
                    + "'" + bt.getGenre() + "',"
                    + "'" + bt.getPages() + "',"
                    + "'" + bt.getPublicationyear() + "',"
                    + "'" + bt.getUrl() + "',"
                    + "'" + bt.getPhoto() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The book was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditBooksTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public JSONArray GetBooksPerCategory() throws ClassNotFoundException, SQLException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians");
            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                JSONObject json = new JSONObject();
                json.put("libraryname", rs.getString("libraryname"));
                int library_id = rs.getInt("library_id");
                int numberOfBooks = 0;

                //New Call to get the number of books for that library
                Connection con2 = DB_Connection.getConnection();
                String query2 = "SELECT COUNT(*) AS rowcount FROM booksinlibraries WHERE library_id = ?";
                PreparedStatement preparedStmt2 = con2.prepareStatement(query2);
                preparedStmt2.setInt(1, library_id);
                ResultSet rs3 = preparedStmt2.executeQuery();

                if (rs3.next()) {
                    numberOfBooks = rs3.getInt("rowcount");
                }
                con2.close();
                json.put("numberOfBooks", numberOfBooks);
                jsonArray.put(json);
            }
            con.close();
            return jsonArray;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }
}
