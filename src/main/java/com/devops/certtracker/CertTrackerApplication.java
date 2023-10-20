package com.devops.certtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.devops.certtracker.service")
public class CertTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CertTrackerApplication.class, args);
	}

}
