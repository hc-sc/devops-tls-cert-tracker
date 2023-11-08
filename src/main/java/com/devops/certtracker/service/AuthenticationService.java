package com.devops.certtracker.service;

import com.devops.certtracker.dto.request.SigninRequest;
import com.devops.certtracker.dto.request.SignupRequest;
import com.devops.certtracker.dto.response.MessageResponse;
import com.devops.certtracker.dto.response.UserInfoResponse;
import com.devops.certtracker.entity.*;
import com.devops.certtracker.event.RegistrationCompleteEvent;
import com.devops.certtracker.event.listener.RegistrationCompleteEventListener;
import com.devops.certtracker.exception.RefreshTokenException;
import com.devops.certtracker.repository.RoleRepository;
import com.devops.certtracker.repository.UserRepository;
import com.devops.certtracker.repository.VerificationTokenRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private ApplicationEventPublisher publisher;
    @Autowired
    private HttpServletRequest servletRequest;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private VerificationTokenService verificationTokenService;
    @Autowired
    private RegistrationCompleteEventListener eventListener;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    public ResponseEntity<?> authenticate(SigninRequest signinRequest) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        ResponseCookie jwtCookie = jwtService.generateJwtCookie(userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
        ResponseCookie jwtRefreshCookie = jwtService.generateRefreshJwtCookie(refreshToken.getToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new UserInfoResponse(
                        userDetails.getId(),
                        userDetails.getFirstname(),
                        userDetails.getLastname(),
                        userDetails.getUsername(),
                        roles
                ));
    }
    public ResponseEntity<?> register(SignupRequest signupRequest, HttpServletRequest request) {
        if (userRepository.existsByEmail(signupRequest.getEmail())){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use !"));
        }
        User user = createUserFromRequest(signupRequest);
        userRepository.save(user);
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));
        return ResponseEntity.ok(
                new MessageResponse("User registered successfully!"+
                        "Check your email to complete your registration")
        );
    }
    public String applicationUrl(HttpServletRequest request){
        return "http://"+ request.getServerName() + ":" + request.getServerPort() +
                request.getContextPath();
    }
    private User createUserFromRequest(SignupRequest signupRequest) {
        String encodedPassword = encoder.encode(signupRequest.getPassword());
        Set<String> strRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if(strRoles == null || strRoles.isEmpty()) {
            roles.add(getRole(ERole.ROLE_USER));
        }else {
            strRoles.forEach(role -> roles.add(getRole(mapRoleStringToEnum(role))));
        }
        User user = new User(signupRequest.getFirstname(),signupRequest.getLastname(),signupRequest.getEmail(),encodedPassword);
        user.setRoles(roles);
        return  user;
    }

    private Role getRole(ERole roleName) {
        return  roleRepository.findByName(roleName)
                .orElseThrow( () -> new RuntimeException("Error: Role is not found"));
    }

    private ERole mapRoleStringToEnum(String strRole) {
        return switch (strRole) {
            case "admin" -> ERole.ROLE_ADMIN;
            case "mod" -> ERole.ROLE_MODERATOR;
            default -> ERole.ROLE_USER;
        };
    }

    public String sendVerificationToken(String token){
        String url = applicationUrl(servletRequest)+"/api/auth/resend-verification-token?token="+token;

        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        if(verificationToken.getUser().isEnabled()){
            return "This account has already been verified, please login";
        }
        String verificationResult = verificationTokenService.validateToken(token);
        if(verificationResult.equalsIgnoreCase("valid")){
            return "Email verified successfully. You can now login to your account";
        }
        return "Invalid verification link, <a href=\"" +url+"\"> Get a new verification link. </a>";
    }



    public String resendVerificationToken(String oldToken, HttpServletRequest request)
            throws MessagingException, UnsupportedEncodingException {
        VerificationToken verificationToken = verificationTokenService.generateNewVerificationToken(oldToken);
        User user = verificationToken.getUser();
        resendRegistrationVerificationTokenEmail(user, applicationUrl(request), verificationToken);
        return "A new verification link has been sent to your email. "+
                "Please check your email to activate your \n";
    }

    private void resendRegistrationVerificationTokenEmail(
            User user, String applicationUrl, VerificationToken verificationToken)
            throws MessagingException, UnsupportedEncodingException {
        String url = applicationUrl+"/api/auth/verifyEmail?token="+verificationToken.getToken();
        eventListener.sendVerificationEmail(user,url);
    }


    public ResponseEntity<?> signout() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!principal.toString().equals("anonymousUser")) {
            Long userId = ((UserDetailsImpl) principal).getId();
            String refreshToken = jwtService.getJwtRefreshFromCookies(request);
            // Check if the token is valid before deleting
            if (refreshToken != null && refreshToken.length() > 0) {
                refreshTokenService.deleteByToken(refreshToken);
            }
        }
        ResponseCookie jwtCookie = jwtService.getCleanJwtCookie();
        ResponseCookie jwtRefreshCookie = jwtService.getCleanJwtRefreshCookies();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }


    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = jwtService.getJwtRefreshFromCookies(request);
        logger.info("Received refresh token: " + refreshToken);

        if ((refreshToken != null) && refreshToken.length()>0) {
            return refreshTokenService.findByToken(refreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        ResponseCookie jwtCookie = jwtService.generateJwtCookie(user);
                        return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                                .body(new MessageResponse("Your access token is refreshed successfully!"));
                    }).orElseThrow(() -> new RefreshTokenException(refreshToken, "Refresh token is not in database"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Refresh Token is empty !"));
    }

}

