package com.library.backend.Entity;


import javax.persistence.*;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "book")
@Data
@NoArgsConstructor
public class Book implements Serializable {

    private static final long serialVersionUID = -4439114469417994311L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increase id
    @Column(name="id")
    private Long id;
    @Column(name="title")
    private String title;

    @Column(name="author")
    private String author;

    @Column(name="description")
    private String description;
    @Column(name="copies")
    private int copies;
    @Column(name="copies_available")
    private int copiesAvailable;
    @Column(name="category")
    private String category;

    @Column(name="img")
    private String img;
}
