package com.example.paymentgateway.Controller;

import com.example.paymentgateway.Entity.Course;
import com.example.paymentgateway.Service.AccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/access")
@CrossOrigin("*")
public class AccessController {

    @Autowired
    private AccessService accessService;

    @GetMapping("/courses")
    public ResponseEntity<?> getUserCourses(@RequestParam String email) {
        try {
            List<Course> courses = accessService.getUserCourses(email);
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
