package com.library.backend.service;

import com.library.backend.Entity.Review;
import com.library.backend.dao.BookRepository;
import com.library.backend.dao.ReviewRepository;
import com.library.backend.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class ReviewService {
    private ReviewRepository reviewRepository;
    @Autowired
    public ReviewService( ReviewRepository reviewRepository){
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception{
        Review validateUserReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if (validateUserReview != null){
            throw new Exception("user already left a review");
        }

        Review userReview = new Review();
        userReview.setBookId(reviewRequest.getBookId());
        userReview.setRating(reviewRequest.getRating());
        userReview.setUserEmail(userEmail);

        if (reviewRequest.getReviewDescription().isPresent()){
            userReview.setReviewDescription(reviewRequest.getReviewDescription().map(
                    Object::toString
            ).orElse(null));
        }
        userReview.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(userReview);
    }

    public Boolean userReviewListed(String userEmail, long bookId){
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateReview != null){
            return true;
        }
        return false;
    }
}
