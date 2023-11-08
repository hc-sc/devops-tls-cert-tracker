package com.devops.certtracker.controller;

import com.devops.certtracker.dto.request.SigninRequest;
import com.devops.certtracker.dto.request.SignupRequest;
import com.devops.certtracker.service.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody SignupRequest signupRequest, final HttpServletRequest request){
        return authenticationService.register(signupRequest, request);
    }

    @GetMapping("/verifyEmail")
    public ResponseEntity<String> sendVerificationToken(@RequestParam("token") String token){
        String response =   authenticationService.sendVerificationToken(token);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/resend-verification-token")
    public ResponseEntity<String> resendVerificationToken(@RequestParam("token") String oldToken, final HttpServletRequest request)
            throws MessagingException, UnsupportedEncodingException {
        String response = authenticationService.resendVerificationToken(oldToken, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@Valid @RequestBody SigninRequest signinRequest){
        return authenticationService.authenticate(signinRequest);
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signout(){
        return authenticationService.signout();
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request){
        return authenticationService.refreshToken(request);
    }

}
