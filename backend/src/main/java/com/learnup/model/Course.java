package com.learnup.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String instructor;
    private String category;
    private double price;
    private String image;
    private String description;

    @Column(length = 2000)
    private String videos; // JSON string: [{"title":"Intro","url":"https://..."}]
    private String duration;

    // NEW: Live Meet - per course
    private String meetLink;
    private String liveClassTitle;
    private String liveClassAt;

    // NEW: Documents / PDFs - per course - JSON: [{"title":"Notes","url":"https://..."}]
    @Column(length = 2000)
    private String documents;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getVideos() { return videos; }
    public void setVideos(String videos) { this.videos = videos; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getMeetLink() { return meetLink; }
    public void setMeetLink(String meetLink) { this.meetLink = meetLink; }
    public String getLiveClassTitle() { return liveClassTitle; }
    public void setLiveClassTitle(String liveClassTitle) { this.liveClassTitle = liveClassTitle; }
    public String getLiveClassAt() { return liveClassAt; }
    public void setLiveClassAt(String liveClassAt) { this.liveClassAt = liveClassAt; }

    public String getDocuments() { return documents; }
    public void setDocuments(String documents) { this.documents = documents; }
}