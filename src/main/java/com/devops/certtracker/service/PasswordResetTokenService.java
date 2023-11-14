package com.devops.certtracker.service;

import com.devops.certtracker.entity.User;
import com.devops.certtracker.entity.PasswordResetToken;
import com.devops.certtracker.repository.UserRepository;
import com.devops.certtracker.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    private UserRepository userRepository;
    @Value("${application.jwt.verification.expiration}")
    private Long passwordResetTokenExpiration;
    public PasswordResetToken createPasswordResetToken(User user){
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setUser(user);
        passwordResetToken.setExpirationDate(Instant.now().plusMillis(passwordResetTokenExpiration));
        passwordResetToken.setToken(UUID.randomUUID().toString());
        passwordResetToken = passwordResetTokenRepository.save(passwordResetToken);
        return passwordResetToken;
    }


    public String validateToken(String token) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
        if (passwordResetToken == null) {
            return "Invalid password reset token";
        }

        if (passwordResetToken.getExpirationDate().compareTo(Instant.now()) <= 0) {
            passwordResetTokenRepository.delete(passwordResetToken);
            return "The link has already expired. Please resend the link.";

        }
        return "valid";
    }

    public Optional<User> findUserByPasswordToken(String passwordResetToken) {
        return Optional.ofNullable(passwordResetTokenRepository.findByToken(passwordResetToken).getUser());
    }

    public PasswordResetToken findPasswordResetToken(String token){
        return passwordResetTokenRepository.findByToken(token);
    }

}
