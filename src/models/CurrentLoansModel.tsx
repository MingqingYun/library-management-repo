import React from 'react';
import BookModel from './BookModel';


class CurrentLoansModel{
    book: BookModel;
    daysLeft: number;


    constructor (book: BookModel, daysLeft:number){
        this.book = book;
        this.daysLeft = daysLeft
    }
}

export default CurrentLoansModel;