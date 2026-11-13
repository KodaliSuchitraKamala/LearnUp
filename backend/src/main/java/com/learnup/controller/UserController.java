package com.learnup.controller;

import com.learnup.model.User;
import com.learnup.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<User> getAll() {
        return repo.findAll();
    }

    @GetMapping("/role/{role}")
    public List<User> getByRole(@PathVariable String role) {
        return repo.findByRole(role.toUpperCase());
    }

    @PostMapping("/register")
    public User register(@RequestBody User u) {
        Optional<User> existing = repo.findByEmail(u.getEmail());
        if (existing.isPresent()) {
            return existing.get();
        }
        if (u.getRole() == null || u.getRole().isEmpty()) {
            u.setRole("STUDENT");
        } else {
            u.setRole(u.getRole().toUpperCase());
        }
        return repo.save(u);
    }

    @PostMapping("/login")
    public User login(@RequestBody User u) {
        return repo.findByEmail(u.getEmail())
            .filter(db -> db.getPassword().equals(u.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}