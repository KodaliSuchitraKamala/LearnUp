package com.learnup.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    @PostMapping
    public ResponseEntity<Map<String,String>> upload(@RequestParam("file") MultipartFile file) throws Exception {
        Path dir = Paths.get("uploads");
        if (!Files.exists(dir)) Files.createDirectories(dir);
        // Keep original name, make unique if same name exists
        String original = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = System.currentTimeMillis() + "_" + original;
        Path path = dir.resolve(fileName);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        Map<String,String> res = new HashMap<>();
        res.put("fileName", original);
        res.put("url", "/uploads/" + fileName);
        res.put("size", String.valueOf(file.getSize()));
        return ResponseEntity.ok(res);
    }
}