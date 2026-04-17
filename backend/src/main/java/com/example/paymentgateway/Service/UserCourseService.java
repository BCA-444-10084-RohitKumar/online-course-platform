package com.example.paymentgateway.Service;

import com.example.paymentgateway.Entity.UserCourse;
import com.example.paymentgateway.Repo.UserCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserCourseService {

    @Autowired private UserCourseRepository repo;

    public UserCourse purchaseCourse(Long userId, Long courseId) {
        if (repo.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("Already enrolled in this course.");
        }
        return repo.save(new UserCourse(userId, courseId));
    }
}
