/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditBooksInLibraryTable;
import database.tables.EditBooksTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Book;
import mainClasses.BookInLibrary;

/**
 *
 * @author aleks
 */
@WebServlet(name = "ChangeAvailabilityOfBook", urlPatterns = {"/ChangeAvailabilityOfBook"})
public class ChangeAvailabilityOfBook extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet ChangeAvailabilityOfBook</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ChangeAvailabilityOfBook at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //check if librarian
        HttpSession session = request.getSession();
        String type = (String) session.getAttribute("type");
        int libraryId = (int) session.getAttribute("loggedIn");
        String isbn = request.getParameter("isbn");
        String availability = request.getParameter("availability");
        EditBooksTable ebt = new EditBooksTable();
        EditBooksInLibraryTable ebil = new EditBooksInLibraryTable();

        if (type.equals("librarian")) {
            try {
                //check if book exists
                Book exists = ebt.databaseBook_Check_ISBN(isbn);
                if (exists == null) {
                    response.setStatus(403);
                } else {
                    //check if exists in the table booksinlibraries
                    BookInLibrary existss = ebil.databaseCheck_ISBN(isbn, libraryId);
                    if (existss == null) {
                        //add a new entry
                        BookInLibrary newBookInLibrary = new BookInLibrary();
                        newBookInLibrary.setAvailable(availability);
                        newBookInLibrary.setIsbn(isbn);
                        newBookInLibrary.setLibrary_id(libraryId);
                        ebil.createNewBookInLibrary(newBookInLibrary);
                    } else {
                        //update the old entry
                        ebil.updateBookInLibraryBasedOnIsbn(isbn, libraryId, availability);
                    }
                    response.setStatus(200);
                }
            } catch (SQLException ex) {
                Logger.getLogger(ChangeAvailabilityOfBook.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ChangeAvailabilityOfBook.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
