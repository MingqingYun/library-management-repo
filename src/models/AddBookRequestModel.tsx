import React from "react";

class AddBookRequestModel{
    title: string;
    author: string;
    description:string;
    copies: number;
    category: string;
    img?: string;

    constructor (title: string, author: string, description:string, copies: number,  category: string){
        this.title=title;
        this.author=author;
        this.copies=copies;
        this.description = description;
        this.category=category;
    }
}

export default AddBookRequestModel