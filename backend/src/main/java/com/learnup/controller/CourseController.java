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

    // NEW: Update - for Edit, Videos, Documents, Meet per course
    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course updated) {
        Course c = repo.findById(id).orElseThrow();
        if (updated.getTitle() != null) c.setTitle(updated.getTitle());
        if (updated.getCategory() != null) c.setCategory(updated.getCategory());
        if (updated.getPrice() != 0) c.setPrice(updated.getPrice());
        if (updated.getDescription() != null) c.setDescription(updated.getDescription());
        if (updated.getImage() != null) c.setImage(updated.getImage());
        if (updated.getVideos() != null) c.setVideos(updated.getVideos());
        if (updated.getDocuments() != null) c.setDocuments(updated.getDocuments());
        if (updated.getMeetLink() != null) c.setMeetLink(updated.getMeetLink());
        if (updated.getLiveClassTitle() != null) c.setLiveClassTitle(updated.getLiveClassTitle());
        if (updated.getLiveClassAt() != null) c.setLiveClassAt(updated.getLiveClassAt());
        if (updated.getDuration() != null) c.setDuration(updated.getDuration());
        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}