package com.learnup.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "follows")
public class Follow {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String instructorName;
    private String studentName;
    private String studentEmail;
    private LocalDateTime followedAt = LocalDateTime.now();

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getInstructorName(){return instructorName;} public void setInstructorName(String s){this.instructorName=s;}
    public String getStudentName(){return studentName;} public void setStudentName(String s){this.studentName=s;}
    public String getStudentEmail(){return studentEmail;} public void setStudentEmail(String s){this.studentEmail=s;}
    public LocalDateTime getFollowedAt(){return followedAt;} public void setFollowedAt(LocalDateTime t){this.followedAt=t;}
}