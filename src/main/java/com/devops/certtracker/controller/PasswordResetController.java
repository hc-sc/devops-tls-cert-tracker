package com.devops.certtracker.controller;


import com.devops.certtracker.service.AuthenticationService;
import com.devops.certtracker.service.PasswordResetTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequiredArgsConstructor
public class PasswordResetController {
    private final AuthenticationService authenticationService;
    private final PasswordResetTokenService passwordResetTokenService;
    @GetMapping("/form")
    public String getPasswordResetForm(@RequestParam("token") String token, Model model) {
        model.addAttribute("token", token);
        String response = passwordResetTokenService.validateToken(token);
        if(response.equalsIgnoreCase("valid")){
            return "reset-password-form";
        }else{
            model.addAttribute("message",response);
            return "error-form";
        }
    }

}
