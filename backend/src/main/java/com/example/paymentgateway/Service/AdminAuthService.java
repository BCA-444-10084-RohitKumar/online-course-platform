package com.example.paymentgateway.Service;

import com.example.paymentgateway.Entity.*;
import com.example.paymentgateway.Repo.UserRepository;
import com.example.paymentgateway.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtil jwtUtil;

    public LoginResponse adminLogin(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin account not found."));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied. This account does not have admin privileges.");
        }

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid admin password.");
        }

        String token = jwtUtil.generateToken(email, "ADMIN");
        return new LoginResponse(
                user.getId(), user.getName(), user.getEmail(),
                "ADMIN", token, "Admin login successful!"
        );
    }
}
