package com.example.paymentgateway.Service;

import com.example.paymentgateway.Entity.Course;
import com.example.paymentgateway.Entity.UserCourse;
import com.example.paymentgateway.Repo.CourseRepository;
import com.example.paymentgateway.Repo.UserCourseRepository;
import com.example.paymentgateway.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccessService {

    @Autowired private UserRepository       userRepo;
    @Autowired private UserCourseRepository userCourseRepo;
    @Autowired private CourseRepository     courseRepo;

    public List<Course> getUserCourses(String email) {
        Long userId = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email))
                .getId();

        List<Long> courseIds = userCourseRepo.findByUserId(userId)
                .stream()
                .map(UserCourse::getCourseId)
                .collect(Collectors.toList());

        return courseRepo.findAllById(courseIds);
    }
}
