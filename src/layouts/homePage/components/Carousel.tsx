import React from 'react';
import { ReturnBooks } from './Returnbooks';
import { useEffect, useState } from 'react';
import BookModel from '../../../models/BookModel';
import SpinnerLoading from '../../utils/SpinnerLoading';
import { BASEURL } from '../../../lib/baseUrlConfig';

function Carousel(){
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(()=> {
        const fetchBooks = async ()=>{
            const baseUrl:string = `${BASEURL.url}/books`;
            const url: string = `${baseUrl}?page=0&size=9`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Something went wrong please check!");
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;

            const loadedBooks: BookModel [] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img
                })
            }
            setBooks(loadedBooks);
            setIsLoading(false);
        }
        fetchBooks().catch((error:any)=>{
            setIsLoading(false);
            setHttpError(error.message);
        })

    }, []);

    if (isLoading){
        return(<div>
            <SpinnerLoading />
        </div>)
    }

    if (httpError){
        return(<div>
            <p> {httpError} </p>
        </div>)
    }

    return(
        <div id="carouselExampleIndicators" className="carousel carousel-dark slide" style={{marginBottom:'50px'}} >
            <div className="text-center" style={{marginBottom:'30px'}}>
                <h3>Find my next book!</h3>
            </div>
            <div className="carousel-indicators" style={{top: '450px'}}>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            
            <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="10000">
                    <div className="row d-flex justify-content-center align-items-center">
                        {books.slice(0,3).map(book => (
                            <ReturnBooks book={book} key={book.id}/>
                        ))}
                    </div>  
                </div>
                <div className="carousel-item">
                    <div className="row d-flex justify-content-center align-items-center">
                        {books.slice(3,6).map(book => (
                                <ReturnBooks book={book} key={book.id}/>
                            ))}
                    </div>  
                </div>
                <div className="carousel-item">
                    <div className="row d-flex justify-content-center align-items-center">
                        {books.slice(6,9).map(book => (
                            <ReturnBooks book={book} key={book.id}/>
                        ))}
                    </div>  
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" 
            data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>



    );
}

export default Carousel;