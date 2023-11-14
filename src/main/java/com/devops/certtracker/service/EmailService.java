package com.devops.certtracker.service;

import com.devops.certtracker.entity.Certificate;
import com.devops.certtracker.entity.EmailInformation;
import com.devops.certtracker.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") private String from;

    @Autowired
    private  CertificateService certificateService;

    public void sendVerificationEmail(User user, String url) throws MessagingException, UnsupportedEncodingException {
        String subject = "Email Verification / Vérification de courriel";
        String senderName = "Certificate Tracker Service / Service de Suivi des Certificats";
        String mailContent = "<html><body>" +
                "<p>La version française de ce message suit.</p>" +
                "<p>Hi " + user.getFirstname() + ",</p>" +
                "<p>Thank you for choosing our Ceryificate Tracker Service. Your registration is almost complete, but there is one important step left to take.</p>" +
                "<p>Please, follow the link below to verify your email address and activate your account:</p>" +
                "<p><a href=\"" + url + "\">Click here to verify your email address</a></p>" +
                "<p>This link will expire in 10 minutes, so make sure to complete the verification process promptly.</p>" +
                "<p>If the link does not work, please copy and paste the following URL into your web browser:</p>" +
                "<p>" + url + "</p>" +
                "<p>Thank you for choosing our service.</p>" +
                "<p>Best Regards,</p>" +
                "<p>Certificate Tracker Service (c)<br>cert.tracker.app@gmail.com</p>" +
                "<hr><br>" +

                "<p>Salut " + user.getFirstname() + ",</p>" +
                "<p>Nous tenons à vous remercier d'avoir choisi notre Service de Suivi des Certificats. Votre inscription est presque terminée, mais il reste une étape importante à accomplir.</p>" +
                "<p>Veuillez suivre le lien ci-dessous pour vérifier votre adresse électronique et activer votre compte:</p>" +
                "<p><a href=\"" + url + "\">Cliquez ici pour vérifier votre adresse électronique</a></p>" +
                "<p>Ce lien expirera dans 10 minutes, veuillez donc vous assurer de compléter le processus de vérification rapidement.</p>" +
                "<p>Si le lien ne fonctionne pas, veuillez copier et coller l'URL suivante dans votre navigateur web:</p>" +
                "<p>" + url + "</p>" +
                "<p>Nous vous remercions d'avoir choisi notre service.</p>" +
                "<p>Cordialement,</p>" +
                "<p>Service de Suivi des Certificats (c)<br>cert.tracker.app@gmail.com</p>" +
                "</body></html>";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom("cert.tracker.app@gmail.com", senderName);
        messageHelper.setTo(user.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        javaMailSender.send(message);
    }

    public void sendPasswordResetVerificationEmail(User user, String url)
            throws MessagingException, UnsupportedEncodingException {
        String subject = "Password Reset Request / Réinitialisation du mot de passe";
        String senderName = "Certificate Tracker Service / Service de Suivi des Certificats";
        String mailContent = "<html><body>" +
                "<p>La version française de ce message suit.</p>" +
                "<p>Hi " + user.getFirstname() + ",</p>" +
                "<p><b>You recently requested to reset your password,</b></p>" +
                "<p>Please, follow the link below to complete the action:</p>" +
                "<p><a href=\"" + url + "\">Reset password</a></p>" +
                "<p>This link will expire in 10 minutes, so make sure to complete the verification process promptly.</p>" +
                "<p>Thank you for choosing our service.</p>" +
                "<p>Best Regards,</p>" +
                "<p>Certificate Tracker Service (c)<br>cert.tracker.app@gmail.com</p>" +
                "<hr><br>" +

                "<p>Salut " + user.getFirstname() + ",</p>" +
                "<p><b>Vous avez récemment demandé la réinitialisation de votre mot de passe,</b></p>" +
                "<p>Veuillez suivre le lien ci-dessous pour compléter l'action:</p>" +
                "<p><a href=\"" + url + "\">Réinitialiser le mot de passe</a></p>" +
                "<p>Ce lien expirera dans 10 minutes, veuillez donc vous assurer de compléter le processus de vérification rapidement.</p>" +
                "<p>Nous vous remercions d'avoir choisi notre service.</p>" +
                "<p>Cordialement,</p>" +
                "<p>Service de Suivi des Certificats (c)<br>cert.tracker.app@gmail.com</p>" +
                "</body></html>";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom("cert.tracker.app@gmail.com", senderName);
        messageHelper.setTo(user.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        javaMailSender.send(message);
    }

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
