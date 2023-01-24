/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditBorrowingTable;
import database.tables.EditStudentsTable;
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
@WebServlet(name = "ReturnABook", urlPatterns = {"/ReturnABook"})
public class ReturnABook extends HttpServlet {

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
            out.println("<title>Servlet ReturnABook</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ReturnABook at " + request.getContextPath() + "</h1>");
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
        if (typeUser.equals("student")) {
            try {

                String studentId_str = (String) session.getAttribute("loggedIn");
                EditStudentsTable est = new EditStudentsTable();

                int studentId = est.getStudentId(studentId_str);

                String borrowing_id = (String) request.getParameter("borrowing_id");
                //check if the status if borrowed
                EditBorrowingTable ebt = new EditBorrowingTable();
                Borrowing borrowing = ebt.checkIfBookIsBorrowing(Integer.parseInt(borrowing_id));
                if (borrowing != null) {
                    //Change the status to returned
                    borrowing.setStatus("returned");
                    ebt.updateBorrowingData(borrowing);
                    response.setStatus(200);
                } else {
                    //throw an error
                    response.setStatus(404);
                }
            } catch (SQLException ex) {
                Logger.getLogger(ReturnABook.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ReturnABook.class.getName()).log(Level.SEVERE, null, ex);
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
