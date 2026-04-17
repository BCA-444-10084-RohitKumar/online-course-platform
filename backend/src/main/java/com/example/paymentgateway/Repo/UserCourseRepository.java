package com.example.paymentgateway.Repo;

import com.example.paymentgateway.Entity.UserCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
    List<UserCourse> findByUserId(Long userId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    long countByUserId(Long userId);
}
