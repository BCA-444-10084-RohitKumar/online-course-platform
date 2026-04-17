package com.example.paymentgateway.Service;

import com.example.paymentgateway.Entity.*;
import com.example.paymentgateway.Repo.UserRepository;
import com.example.paymentgateway.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtil jwtUtil;

    public String register(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered. Please login.");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        userRepo.save(user);
        return "Registration successful! Welcome to EduVerse.";
    }

    public LoginResponse login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email."));
        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password. Please try again.");
        }
        String token = jwtUtil.generateToken(email, user.getRole().name());
        return new LoginResponse(
                user.getId(), user.getName(), user.getEmail(),
                user.getRole().name(), token, "Login successful!"
        );
    }

    public String resetPassword(String email, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found."));
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
        return "Password reset successful!";
    }
}
