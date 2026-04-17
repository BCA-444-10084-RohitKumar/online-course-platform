package com.example.paymentgateway.Service;

import com.example.paymentgateway.Entity.*;
import com.example.paymentgateway.Repo.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")     private String keyId;
    @Value("${razorpay.key.secret}") private String keySecret;

    @Autowired private PaymentRepo          paymentRepo;
    @Autowired private UserCourseRepository userCourseRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;
    @Autowired private EmailService         emailService;

    /**
     * Creates a Razorpay order and persists a PENDING payment record.
     * Returns raw Razorpay JSON so the frontend can open the checkout.
     */
    public String createOrder(PaymentOrder order) throws Exception {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount",   (int)(order.getAmount() * 100)); // paise
        options.put("currency", "INR");
        options.put("receipt",  "receipt_" + System.currentTimeMillis());
        options.put("payment_capture", 1);

        Order rzpOrder = client.orders.create(options);

        order.setOrderId(rzpOrder.get("id"));
        order.setStatus("PENDING");
        paymentRepo.save(order);

        return rzpOrder.toString();
    }

    /**
     * Called after Razorpay payment completes.
     * Updates status, creates enrollment, sends email.
     */
    public void updateOrderStatus(String paymentId, String orderId, String status) {
        PaymentOrder order = paymentRepo.findByOrderId(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found: " + orderId);
        }

        order.setPaymentId(paymentId);
        order.setStatus(status.toUpperCase());
        paymentRepo.save(order);

        if ("PAID".equalsIgnoreCase(status)) {
            // Grant course access — prevent duplicates
            if (order.getUserId() != null && order.getCourseId() != null) {
                if (!userCourseRepo.existsByUserIdAndCourseId(order.getUserId(), order.getCourseId())) {
                    userCourseRepo.save(new UserCourse(order.getUserId(), order.getCourseId()));
                }
                if (!enrollmentRepo.existsByUserIdAndCourseId(order.getUserId(), order.getCourseId())) {
                    enrollmentRepo.save(new Enrollment(order.getUserId(), order.getCourseId()));
                }
            }

            // Send confirmation email
            emailService.sendPaymentConfirmation(
                    order.getEmail(),
                    order.getName(),
                    order.getCourseName(),
                    order.getAmount()
            );
        }
    }
}
