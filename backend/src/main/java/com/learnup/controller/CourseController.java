package com.learnup.controller;

import com.learnup.model.Course;
import com.learnup.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {
    private final CourseRepository repo;
    public CourseController(CourseRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Course> getAll() { return repo.findAll(); }

    @GetMapping("/search")
    public List<Course> search(@RequestParam String keyword) {
        return repo.findByTitleContainingIgnoreCaseOrInstructorContainingIgnoreCase(keyword, keyword);
    }

    @PostMapping
    public Course create(@RequestBody Course c) { return repo.save(c); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}