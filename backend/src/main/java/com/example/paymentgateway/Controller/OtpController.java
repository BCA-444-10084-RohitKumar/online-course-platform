package com.example.paymentgateway.Controller;

import com.example.paymentgateway.Service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin("*")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        String otp = otpService.generateOtp(email);
        System.out.println("OTP for " + email + ": " + otp); // replace with email send
        return ResponseEntity.ok("OTP sent successfully to " + email);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestParam String email,
                                            @RequestParam String otp) {
        boolean valid = otpService.validateOtp(email, otp);
        if (valid) return ResponseEntity.ok("OTP verified successfully.");
        return ResponseEntity.badRequest().body("Invalid or expired OTP.");
    }
}
