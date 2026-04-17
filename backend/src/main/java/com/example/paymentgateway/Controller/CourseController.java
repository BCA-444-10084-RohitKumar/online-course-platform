package com.example.paymentgateway.Controller;

import com.example.paymentgateway.Entity.Course;
import com.example.paymentgateway.Entity.UserCourse;
import com.example.paymentgateway.Service.CourseService;
import com.example.paymentgateway.Service.UserCourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class CourseController {

    private final CourseService      courseService;
    private final UserCourseService  userCourseService;

    public CourseController(CourseService courseService,
                            UserCourseService userCourseService) {
        this.courseService     = courseService;
        this.userCourseService = userCourseService;
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(courseService.getCourseById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/courses/search")
    public ResponseEntity<List<Course>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(courseService.searchCourses(keyword));
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseCourse(@RequestParam Long userId,
                                            @RequestParam Long courseId) {
        try {
            UserCourse uc = userCourseService.purchaseCourse(userId, courseId);
            return ResponseEntity.ok(uc);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
