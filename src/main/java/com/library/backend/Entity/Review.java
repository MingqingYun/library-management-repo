package com.library.backend.Entity;


import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="review")
public class Review {

    public Review(){

    }
    public Review(String userEmail, Date date, double rating, Long bookId, String reviewDescription){
        this.userEmail = userEmail;
        this.date = date;
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;
    @Column(name="user_email")
    private String userEmail;
    @Column(name="date")
    private Date date;
    @Column(name="rating")
    private double rating;
    @Column(name="book_id")
    private Long bookId;
    @Column(name="review_description")
    private String reviewDescription;
}
