package com.example.paymentgateway.Service;

import com.example.paymentgateway.Entity.*;
import com.example.paymentgateway.Repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AdminService {

    @Autowired private CourseRepository    courseRepo;
    @Autowired private PaymentRepo         paymentRepo;
    @Autowired private UserRepository      userRepo;
    @Autowired private UserCourseRepository userCourseRepo;
    @Autowired private EnrollmentRepository enrollmentRepo;

    // ─── Course CRUD ─────────────────────────────────────────────────────────

    public Course addCourse(Course course) {
        return courseRepo.save(course);
    }

    public Course updateCourse(Long id, Course updated) {
        Course existing = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setVideoUrl(updated.getVideoUrl());
        existing.setImageUrl(updated.getImageUrl());
        existing.setInstructor(updated.getInstructor());
        existing.setCategory(updated.getCategory());
        existing.setDuration(updated.getDuration());
        return courseRepo.save(existing);
    }

    public String deleteCourse(Long id) {
        courseRepo.deleteById(id);
        return "Course deleted successfully.";
    }

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    // ─── Users ───────────────────────────────────────────────────────────────

    public List<User> getAllStudents() {
        return userRepo.findAll();
    }

    // ─── Payments ────────────────────────────────────────────────────────────

    public List<PaymentOrder> getAllTransactions() {
        return paymentRepo.findAll();
    }

    public List<PaymentOrder> getSuccessfulPayments() {
        return paymentRepo.findAllByStatus("PAID");
    }

    // ─── Enrollments ─────────────────────────────────────────────────────────

    public List<UserCourse> getAllEnrollments() {
        return userCourseRepo.findAll();
    }

    // ─── Dashboard Summary ───────────────────────────────────────────────────

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalCourses",      courseRepo.count());
        summary.put("totalStudents",     userRepo.count());
        summary.put("totalTransactions", paymentRepo.count());
        summary.put("totalEnrollments",  userCourseRepo.count());

        double revenue = paymentRepo.findAllByStatus("PAID")
                .stream()
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
        summary.put("totalRevenue", revenue);

        // recent 5 transactions
        List<PaymentOrder> all = paymentRepo.findAll();
        all.sort(Comparator.comparing(p -> p.getCreatedAt() == null ?
                java.time.LocalDateTime.MIN : p.getCreatedAt(), Comparator.reverseOrder()));
        summary.put("recentTransactions", all.stream().limit(5).toList());

        return summary;
    }
}
