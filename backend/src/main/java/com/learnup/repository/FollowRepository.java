package com.learnup.repository;
import com.learnup.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByInstructorName(String instructorName);
    List<Follow> findByStudentEmail(String email);
    boolean existsByInstructorNameAndStudentEmail(String instructorName, String email);
    void deleteByInstructorNameAndStudentEmail(String instructorName, String email);
}