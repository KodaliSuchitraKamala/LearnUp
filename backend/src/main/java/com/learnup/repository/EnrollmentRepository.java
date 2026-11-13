package com.learnup.repository;
import com.learnup.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentEmail(String email);
    List<Enrollment> findByInstructorName(String instructorName);
    List<Enrollment> findByCourseId(Long courseId);
    boolean existsByCourseIdAndStudentEmail(Long courseId, String email);
    void deleteByCourseIdAndStudentEmail(Long courseId, String email);
}