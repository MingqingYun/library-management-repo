package com.library.backend.requestmodels;

import lombok.Data;

@Data
public class AddNewBookRequest {
    private String title;
    private String author;
    private String category;

    private String description;
    private int copies;
    private String img;

}
