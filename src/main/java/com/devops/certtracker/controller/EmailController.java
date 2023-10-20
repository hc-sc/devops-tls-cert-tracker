package com.devops.certtracker.controller;

import com.devops.certtracker.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {
//    private EmailService emailService;
//
//    public EmailController(EmailService emailService) {
//        this.emailService = emailService;
//    }
//
//    @PostMapping("/send")
//    ResponseEntity<String> sendEmail(@RequestBody Map<String, String> requestBody){
//
//        String recipient = requestBody.get("recipient");
//        String response =  emailService.sendListEmail(recipient);
//        return ResponseEntity.ok(response);
//    }

}
