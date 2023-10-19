package com.devops.certtracker.controller;

import com.devops.certtracker.service.CertificateService;
import com.devops.certtracker.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    ResponseEntity<String> sendEmail(@RequestBody Map<String, String> requestBody){

        String recipient = requestBody.get("recipient");
        String response =  emailService.sendListEmail(recipient, 14);
        return ResponseEntity.ok(response);
    }

}
