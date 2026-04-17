package com.example.paymentgateway.Repo;

import com.example.paymentgateway.Entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentOrder, Long> {
    PaymentOrder findByOrderId(String orderId);
    List<PaymentOrder> findAllByEmailAndStatus(String email, String status);
    List<PaymentOrder> findAllByStatus(String status);
    List<PaymentOrder> findAllByUserId(Long userId);
}
