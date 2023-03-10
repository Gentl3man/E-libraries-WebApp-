/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditBooksInLibraryTable;
import database.tables.EditBorrowingTable;
import database.tables.EditLibrarianTable;
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
import mainClasses.Borrowing;

/**
 *
 * @author aleks
 */
@WebServlet(name = "ApproveAReturn", urlPatterns = {"/ApproveAReturn"})
public class ApproveAReturn extends HttpServlet {

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
            out.println("<title>Servlet ApproveAReturn</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ApproveAReturn at " + request.getContextPath() + "</h1>");
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
        HttpSession session = request.getSession();

        String typeUser = (String) session.getAttribute("type");
        if (typeUser.equals("librarian")) {

            try {
                String librarianId_str = (String) session.getAttribute("logginId");
                EditLibrarianTable elt = new EditLibrarianTable();
                int librarianId = elt.getLibrarianId(librarianId_str);

                String borrowing_id = request.getParameter("borrowing_id");

                EditBorrowingTable ebt = new EditBorrowingTable();
                Borrowing borrowing = ebt.checkIfBookIsReturned(Integer.parseInt(borrowing_id));
                if (borrowing != null) {
                    //Change the status to returned
                    borrowing.setStatus("successEnd");
                    ebt.updateBorrowingData(borrowing);
                    EditBooksInLibraryTable ebilt = new EditBooksInLibraryTable();
                    //Update in the booksinLibrary as available

                    ebilt.updateBookInLibrary(String.valueOf(borrowing.getBookcopy_id()), "true");
                    response.setStatus(200);
                } else {
                    //throw an error
                    response.setStatus(404);
                }
            } catch (SQLException ex) {
                Logger.getLogger(ApproveAReturn.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ApproveAReturn.class.getName()).log(Level.SEVERE, null, ex);
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
