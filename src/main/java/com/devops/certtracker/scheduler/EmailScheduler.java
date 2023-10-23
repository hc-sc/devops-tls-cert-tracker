package com.devops.certtracker.scheduler;

import com.devops.certtracker.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class EmailScheduler {
    @Autowired
    private EmailService emailService;

    // Schedule an email to be sent out every week on Monday morning at 8:00 AM.
    @Scheduled(fixedRate = 604800000)
    public void sendEmail() {
        emailService.sendListEmail("kyle.ryc@gmail.com", 14);
    }

}
