import React from 'react';


class BookModel{
    id:number;
    title: string;
    author?: string;
    description?:string;
    copies?: number;
    copiesAvailable?: number;
    category?: string;
    img?: string;

    constructor (id: number, title: string, author: string, copies: number, copies_available: number, category: string, img: string){
        this.id=id;
        this.title=title;
        this.author=author;
        this.copies=copies;
        this.copiesAvailable=copies_available;
        this.category=category;
        this.img=img;
    }
}

export default BookModel;