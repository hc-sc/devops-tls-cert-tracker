package com.devops.certtracker.controller;

import com.devops.certtracker.entity.Certificate;
import com.devops.certtracker.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    @Autowired
    private CertificateService certificateService;

    @PostMapping("/add")
    public ResponseEntity<Object> addCertificate(@RequestBody Map<String, String> requestBody) {
        String url = requestBody.get("url");
        Certificate certificate = certificateService.retrieveAndSaveCertificate(url);
        return ResponseEntity.ok(certificate);
    }

}
