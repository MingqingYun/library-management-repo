import { Hash } from 'crypto';
import React from 'react';
import { Link } from 'react-router-dom';
import BookModel from '../../../models/BookModel';

export const ReturnBooks: React.FC<{book:BookModel}> = (props) => {
    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {props.book.img? <img src={props.book.img} 
                width='151' 
                height='233' 
                className="d-block mx-auto" alt="..."></img> : 
                <img 
                src={require('../../../Images/BooksImages/book-luv2code-1000.png')} 
                width='151' 
                height='233' 
                className="d-block mx-auto" alt="..." />}
                <div className="mt-2">
                    <h5>{props.book.title}</h5>
                    <p>{props.book.author}</p>
                </div>
                <Link className="btn main-color text-white" type="button" to={`checkout/${props.book.id}`}>Reserve</Link>
            </div>
        </div>
    );
}
