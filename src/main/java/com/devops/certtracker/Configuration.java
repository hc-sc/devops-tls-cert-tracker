package com.devops.certtracker;

import com.devops.certtracker.service.EmailService;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class Configuration {

    @Bean
    public EmailService getEmailServices() {
        return new EmailService();
    }

}
