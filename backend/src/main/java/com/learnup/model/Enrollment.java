package com.learnup.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long courseId;
    private String courseTitle;
    private double price;
    private String studentName;
    private String studentEmail;
    private String instructorName;
    private LocalDateTime enrolledAt = LocalDateTime.now();

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getCourseId(){return courseId;} public void setCourseId(Long courseId){this.courseId=courseId;}
    public String getCourseTitle(){return courseTitle;} public void setCourseTitle(String c){this.courseTitle=c;}
    public double getPrice(){return price;} public void setPrice(double p){this.price=p;}
    public String getStudentName(){return studentName;} public void setStudentName(String s){this.studentName=s;}
    public String getStudentEmail(){return studentEmail;} public void setStudentEmail(String s){this.studentEmail=s;}
    public String getInstructorName(){return instructorName;} public void setInstructorName(String s){this.instructorName=s;}
    public LocalDateTime getEnrolledAt(){return enrolledAt;} public void setEnrolledAt(LocalDateTime t){this.enrolledAt=t;}
}