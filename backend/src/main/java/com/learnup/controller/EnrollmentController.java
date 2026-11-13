package com.learnup.controller;
import com.learnup.model.Enrollment;
import com.learnup.repository.EnrollmentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {
    private final EnrollmentRepository repo;
    public EnrollmentController(EnrollmentRepository repo){this.repo=repo;}

    @GetMapping
    public List<Enrollment> getAll(@RequestParam(required=false) String instructor, @RequestParam(required=false) String studentEmail){
        if(instructor != null) return repo.findByInstructorName(instructor);
        if(studentEmail != null) return repo.findByStudentEmail(studentEmail);
        return repo.findAll();
    }

    @PostMapping
    public Enrollment enroll(@RequestBody Enrollment e){
        if(e.getCourseId()!=null && e.getStudentEmail()!=null && repo.existsByCourseIdAndStudentEmail(e.getCourseId(), e.getStudentEmail())){
            return repo.findByStudentEmail(e.getStudentEmail()).stream().filter(x -> x.getCourseId().equals(e.getCourseId())).findFirst().orElse(e);
        }
        return repo.save(e);
    }

    @DeleteMapping
    public void unenroll(@RequestParam Long courseId, @RequestParam String studentEmail){
        repo.deleteByCourseIdAndStudentEmail(courseId, studentEmail);
    }
}