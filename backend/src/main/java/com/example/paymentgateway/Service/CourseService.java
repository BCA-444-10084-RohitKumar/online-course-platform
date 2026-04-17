package com.example.paymentgateway.Service;

import com.example.paymentgateway.Entity.Course;
import com.example.paymentgateway.Repo.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {

    @Autowired private CourseRepository courseRepo;

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepo.findByTitleContainingIgnoreCase(keyword);
    }
}
