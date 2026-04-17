package com.example.paymentgateway.Controller;

import com.example.paymentgateway.Entity.PaymentOrder;
import com.example.paymentgateway.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// FIX: Removed @CrossOrigin("*") — it conflicted with SecurityConfig's CORS
// (allowCredentials=true + wildcard origin causes browsers to block requests).
// CORS is already handled globally in SecurityConfig.corsConfigurationSource().
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrder order) {
        try {
            String response = paymentService.createOrder(order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // FIX: Return a JSON-friendly error object so the frontend can
            // read err.response.data.message and show a real error message.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error creating order: " + e.getMessage()));
        }
    }

    @PostMapping("/update-order")
    public ResponseEntity<?> updateOrderStatus(
            @RequestParam String paymentId,
            @RequestParam String orderId,
            @RequestParam String status) {
        try {
            paymentService.updateOrderStatus(paymentId, orderId, status);
            return ResponseEntity.ok(java.util.Map.of("message", "Payment status updated successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
