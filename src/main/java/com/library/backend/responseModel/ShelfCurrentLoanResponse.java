package com.library.backend.responseModel;

import com.library.backend.Entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoanResponse {
    private Book book;
    private int daysLeft;
    public ShelfCurrentLoanResponse(Book book, int daysLeft){
        this.book = book;
        this.daysLeft = daysLeft;
    }
}
