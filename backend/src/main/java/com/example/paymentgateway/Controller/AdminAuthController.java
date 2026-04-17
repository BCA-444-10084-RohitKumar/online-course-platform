package com.example.paymentgateway.Controller;

import com.example.paymentgateway.Entity.LoginResponse;
import com.example.paymentgateway.Entity.User;
import com.example.paymentgateway.Service.AdminAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin("*")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody User user) {
        try {
            LoginResponse response = adminAuthService.adminLogin(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
