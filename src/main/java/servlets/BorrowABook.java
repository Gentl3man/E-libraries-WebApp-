/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditBooksInLibraryTable;
import database.tables.EditBorrowingTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.BookInLibrary;
import mainClasses.Borrowing;

/**
 *
 * @author aleks
 */
@WebServlet(name = "BorrowABook", urlPatterns = {"/BorrowABook"})
public class BorrowABook extends HttpServlet {

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
            out.println("<title>Servlet BorrowABook</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet BorrowABook at " + request.getContextPath() + "</h1>");
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

        try {
            //collect the params
            String isbn = request.getParameter("isbn");
            String library_id = request.getParameter("library_id");
            HttpSession session = request.getSession();

            String typeUser = (String) session.getAttribute("type");
            if (typeUser.equals("student")) {
                //Change the avaliability
                String logginId = (String) session.getAttribute("logginId");
                EditBooksInLibraryTable ebilt = new EditBooksInLibraryTable();
//                ebilt.updateBookInLibraryBasedOnIsbn(isbn, Integer.parseInt(library_id), "false");
                //Add entry to Borrowing

                BookInLibrary bil = ebilt.databaseCheck_ISBN(isbn, Integer.parseInt(library_id));

                LocalDate date = LocalDate.now();
                String dateString = date.toString();
                LocalDate thirtyDaysFromNow = date.plusDays(30);
                String date30daysString = thirtyDaysFromNow.toString();

                EditBorrowingTable ebt = new EditBorrowingTable();
                Borrowing newBorrowing = new Borrowing();
                newBorrowing.setStatus("requested");
                newBorrowing.setUser_id(Integer.parseInt(logginId));
                newBorrowing.setFromDate(dateString);
                newBorrowing.setToDate(date30daysString);
                newBorrowing.setBookcopy_id(bil.getBookcopy_id());

                ebt.createNewBorrowing(newBorrowing);
            }
        } catch (SQLException ex) {
            Logger.getLogger(BorrowABook.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(BorrowABook.class.getName()).log(Level.SEVERE, null, ex);
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
