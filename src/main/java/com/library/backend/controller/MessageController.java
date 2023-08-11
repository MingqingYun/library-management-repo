package com.library.backend.controller;

import com.library.backend.Entity.Message;
import com.library.backend.requestmodels.AdminQuestionRequest;
import com.library.backend.service.MessageService;
import com.library.backend.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:3000","http://librarydemobucket.s3-website-us-west-2.amazonaws.com"})
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private MessageService messageService;
    @Autowired
    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value="Authorization") String token, @RequestBody Message messageRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        messageService.postMessage(userEmail, messageRequest);
    }
    @PutMapping("/secure/admin/message")
    public void respondMessage(@RequestHeader(value="Authorization") String token, @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception{
        String adminEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"" );
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        messageService.putMessage(adminEmail, adminQuestionRequest);
    }
}
