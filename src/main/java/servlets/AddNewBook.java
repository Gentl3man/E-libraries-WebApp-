package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import database.tables.EditBooksTable;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Book;
import mainClasses.JSON_Converter;

/**
 *
 * @author aleks
 */
@WebServlet(name = "AddNewBook", urlPatterns = {"/AddNewBook"})
public class AddNewBook extends HttpServlet {

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
            out.println("<title>Servlet AddNewBook</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet AddNewBook at " + request.getContextPath() + "</h1>");
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
            JSON_Converter jc = new JSON_Converter();

            EditBooksTable ebt = new EditBooksTable();

            Book s = ebt.jsonToBook(jc.getJSONFromAjax(request.getReader()));

            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            try {
                Book exists = ebt.databaseBook_Check_ISBN(s.getIsbn());

                if (exists != null) {
                    response.setStatus(409);
                    Gson gson = new Gson();
                    JsonObject jo = new JsonObject();
                    jo.addProperty("error", "ISBN Allready Taken");
                    response.getWriter().write(jo.toString());
                } else {
                    //REGISTER THE FUCKING USER
                    //and ofc reply with his data and status code of 200
                    ebt.addNewBook(s);
                    response.setStatus(200);
                    response.getWriter().write(ebt.bookToJSON(s));
                }
            } catch (Exception e) {
                System.err.println("Got an exception while registering user ");
                System.err.println(e.getMessage());
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
