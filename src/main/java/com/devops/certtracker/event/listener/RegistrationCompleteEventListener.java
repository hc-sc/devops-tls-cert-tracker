package com.devops.certtracker.event.listener;

import com.devops.certtracker.entity.User;
import com.devops.certtracker.entity.VerificationToken;
import com.devops.certtracker.event.RegistrationCompleteEvent;
import com.devops.certtracker.service.VerificationTokenService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;

@Component
@Slf4j
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {
    @Autowired
    private VerificationTokenService verificationTokenService;
    @Autowired
    private JavaMailSender javaMailSender;
    private User user;
    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {
        user = event.getUser();
        VerificationToken verificationToken = verificationTokenService.createVerificationToken(user);
        String token = verificationToken.getToken();
        String url = event.getApplicationUrl()+"/api/auth/verifyEmail?token="+token;
        try{
            sendVerificationEmail(user, url);
        }catch(MessagingException | UnsupportedEncodingException e){
            throw new RuntimeException(e);
        }
    }

    public void sendVerificationEmail(User user, String url) throws MessagingException, UnsupportedEncodingException{
        String subject = "Email Verification / Vérification de courriel";

        //String senderName = "User Registration Portal Service";
        String senderName = "Certificate Tracker Service / Service de Suivi des Certificats";

        /*String mailContent = "<p> Hi, "+ user.getFirstname()+ ", </p>"+
                "<p>Thank you for registering with us,"+"" +
                "Please, follow the link below to complete your registration.</p>"+
                "<a href=\"" +url+ "\">Verify your email to activate your account</a>"+
                "<p> Thank you <br> Users Registration Portal Service";*/
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
}
