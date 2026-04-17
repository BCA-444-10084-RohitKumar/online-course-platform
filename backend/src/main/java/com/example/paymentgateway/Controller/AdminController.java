package com.example.paymentgateway.Controller;

import com.example.paymentgateway.Entity.*;
import com.example.paymentgateway.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ─── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    // ─── Course CRUD ─────────────────────────────────────────────────────────

    @PostMapping("/course")
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        try {
            return ResponseEntity.ok(adminService.addCourse(course));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/course/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id,
                                          @RequestBody Course course) {
        try {
            return ResponseEntity.ok(adminService.updateCourse(id, course));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/course/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteCourse(id));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    // ─── Users ───────────────────────────────────────────────────────────────

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    // ─── Payments ────────────────────────────────────────────────────────────

    @GetMapping("/transactions")
    public ResponseEntity<List<PaymentOrder>> getTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @GetMapping("/successful-payments")
    public ResponseEntity<List<PaymentOrder>> getSuccessfulPayments() {
        return ResponseEntity.ok(adminService.getSuccessfulPayments());
    }

    // ─── Enrollments ─────────────────────────────────────────────────────────

    @GetMapping("/enrollments")
    public ResponseEntity<List<UserCourse>> getEnrollments() {
        return ResponseEntity.ok(adminService.getAllEnrollments());
    }
}
