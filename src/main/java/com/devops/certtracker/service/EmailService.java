package com.devops.certtracker.service;

import com.devops.certtracker.entity.Certificate;
import com.devops.certtracker.entity.EmailInformation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;


    // End of problems.
    @Value("${spring.mail.username}") private String from;

    @Autowired
    private  CertificateService certificateService;

    /**
     * Write the body of the email to be sent.
     * @param days
     * @return String containing the body of the email.
     */
    public String writeEmailBody(int days){
        StringBuilder message = new StringBuilder("The following certificates are expiring, or have expired, within the next " + days + ":\n");
        List<Certificate> certificates = certificateService.getAllCertificates();
        for(Certificate certificate: certificates){
            Date certExpiry = certificate.getValidTo();
            // Check if certExpiry is before x days from now.
            String shortExpiryDateOnly = certExpiry.toString().substring(0, 10);
            if(certExpiry.before(new Date(System.currentTimeMillis() + (long) days * 24 * 60 * 60 * 1000))) {
                message.append(certificate.getUrl()).append(" - ").append(shortExpiryDateOnly).append("\n");
            }
        }
        return message.toString();
    }

    /**
     * Email the specified recipient with the list of certificates expiring 
     * within the next x days.
     * @param recipient
     * @param daysUntilExpiry - number of days
     * @return String indicating whether the email was sent successfully or not.
     */
    public String sendListEmail(String recipient, int daysUntilExpiry ) {
        try {
            String subject = "Upcoming Certificates Expires";
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setSubject(subject);
            message.setText(writeEmailBody(daysUntilExpiry));
            message.setTo(recipient);
            javaMailSender.send(message);
            return "Email sent successfully";
        }
        catch (Exception e) {
            return "Error sending email: " + e.getMessage();
        }
    }

    /**
     * Email the specified recipient with the list of certificates expiring 
     * within the next 14 days.
     * @param recipient
     * @return string confirming email is sent.
     */
    public String sendListEmail(String recipient) {
        return sendListEmail(recipient, 14);
    }
    



}
