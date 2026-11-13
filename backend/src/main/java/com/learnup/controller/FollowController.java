package com.learnup.controller;
import com.learnup.model.Follow;
import com.learnup.repository.FollowRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/follows")
@CrossOrigin(origins = "*")
public class FollowController {
    private final FollowRepository repo;
    public FollowController(FollowRepository repo){this.repo=repo;}

    @GetMapping
    public List<Follow> getAll(@RequestParam(required=false) String instructor, @RequestParam(required=false) String studentEmail){
        if(instructor != null) return repo.findByInstructorName(instructor);
        if(studentEmail != null) return repo.findByStudentEmail(studentEmail);
        return repo.findAll();
    }

    @PostMapping
    public Follow follow(@RequestBody Follow f){
        if(repo.existsByInstructorNameAndStudentEmail(f.getInstructorName(), f.getStudentEmail())) return f;
        return repo.save(f);
    }

    @DeleteMapping
    public void unfollow(@RequestParam String instructor, @RequestParam String studentEmail){
        repo.deleteByInstructorNameAndStudentEmail(instructor, studentEmail);
    }
}