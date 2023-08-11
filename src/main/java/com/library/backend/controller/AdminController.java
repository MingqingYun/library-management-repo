package com.library.backend.controller;

import com.library.backend.Entity.Book;
import com.library.backend.Entity.Checkout;
import com.library.backend.Entity.History;
import com.library.backend.requestmodels.AddNewBookRequest;
import com.library.backend.responseModel.ShelfCurrentLoanResponse;
import com.library.backend.service.AdminService;
import com.library.backend.service.BookService;
import com.library.backend.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000","http://librarydemobucket.s3-website-us-west-2.amazonaws.com"})
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService){
        this.adminService = adminService;
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value="Authorization") String token, @RequestBody AddNewBookRequest addNewBookRequest)throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"" );
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.postBook(addNewBookRequest);
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value="Authorization") String token, @RequestParam Long BookId) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"" );
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.increaseQuantity(BookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value="Authorization") String token, @RequestParam Long BookId) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"" );
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.decreaseQuantity(BookId);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value="Authorization") String token, @RequestParam Long BookId) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"" );
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.deleteBook(BookId);
    }
}
