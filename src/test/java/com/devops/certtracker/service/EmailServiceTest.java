/**
 * This package contains the service classes for managing certificates.
 */
package com.devops.certtracker.service;

import com.devops.certtracker.entity.Certificate;
import com.devops.certtracker.exception.CertificateNoContentException;
import com.devops.certtracker.exception.CertificateServiceException;
import com.devops.certtracker.exception.EntityNotFoundException;
import com.devops.certtracker.repository.CertificateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test class for the EmailService. It contains test cases for various
 * operations related to emails.
 */
@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    // Mocked repository for simulating interactions with the Certificate database.
    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private CertificateService certificateService;
    // The service under test, which will be automatically injected with mocked dependencies.
    @InjectMocks
    private EmailService emailService;

    // Sample Certificate instances used for testing purposes.
    private Certificate certificate1;
    private Certificate certificate2;


    /**
     * Initialize test data before each test case.
     */
    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        certificate1 = new Certificate();
        certificate1.setUrl("https://www.google.com");
        certificate1.setSubject("CN=google.com");
        certificate1.setIssuer("CN=issuer.com");
        certificate1.setValidFrom(new Date());
        certificate1.setValidTo(new Date());

        certificate2 = new Certificate();
        certificate2.setUrl("https://www.github.com");
        certificate2.setSubject("CN=github.com");
        certificate2.setIssuer("CN=issuer.com");
        certificate2.setValidFrom(new Date());
        certificate2.setValidTo(new Date());
    }

    /**
     * Test sending an email to the user.
     */
    @Test
    @DisplayName("Send email to user")
    public void testSendEmail() {
        // Mock data
        List<Certificate> certificates = new ArrayList<>();
        certificates.add(certificate1);
        certificates.add(certificate2);

        // Mock the repository's findAll() method to return the mock data
        when(certificateRepository.findAll()).thenReturn(certificates);

        // Verify that the email is sent successfully
        assertEquals("Email sent successfully", emailService.sendListEmail("kyle.ryc@gmail.com", 14));

    }

    /**
     * Test getting a list of certificates that are expiring in the next 14 days.
     */
    @Test
    @DisplayName("Get list of certificates expiring in the next 14 days")
    public void testUpcomingCertificatesMessage() {
        // Mock data
        List<Certificate> certificates = new ArrayList<>();
        certificates.add(certificate1);
        certificates.add(certificate2);

        // Mock the repository's findAll() method to return the mock data
        when(certificateRepository.findAll()).thenReturn(certificates);
        int days = 14;

        // Verify that the email is sent successfully
        assertEquals("The following certificates are expiring, or have expired, within the next 14:\n" +
                "https://www.google.com - 2021-04-20\n" +
                "https://www.github.com - 2021-04-20\n", emailService.upcomingCertificatesMessage(days));
    }
}
