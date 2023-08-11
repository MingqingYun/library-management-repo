
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import SpinnerLoading from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import { request } from "http";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { BASEURL } from "../../lib/baseUrlConfig";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();
    const [book, setBook] = useState<BookModel>();
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>();
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loan Count State
    const [currentLoanCount, setCurrentLoanCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // is book checked out
    const [isCheckedout, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);


    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${BASEURL.url}/books/${bookId}`;

            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error("Something went wrong please check!");
            }

            const responseJson = await response.json();

            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img
            };


            setBook(loadedBook);
            setIsLoadingBook(false);
        }
        fetchBooks().catch((error: any) => {
            setIsLoadingBook(false);
            setHttpError(error.message);
        })

    }, [isCheckedout]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${BASEURL.url}/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('something went wrong about fetch reviews');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseDataReviews = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseDataReviews) {
                loadedReviews.push({
                    id: responseDataReviews[key].id,
                    userEmail: responseDataReviews[key].userEmail,
                    date: responseDataReviews[key].date,
                    rating: responseDataReviews[key].rating,
                    bookId: responseDataReviews[key].bookId,
                    reviewDescription: responseDataReviews[key].reviewDescription
                })
                weightedStarReviews = weightedStarReviews + responseDataReviews[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }


            setReviews(loadedReviews);
            setIsLoadingReview(false);

        };
        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft])

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${BASEURL.url}/reviews/secure/user/book/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error("something went wrong");
                }
                const userReivewResponseJson = await userReview.json();
                setIsReviewLeft(userReivewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const userCurrentLoansCountUrl: string = `${BASEURL.url}/books/secure/currentloan/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const currentLoansCountResponse = await fetch(userCurrentLoansCountUrl, requestOptions);
                if (!currentLoansCountResponse.ok) {
                    throw new Error('Something went wrong');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoanCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedout])

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url: string = `${BASEURL.url}/books/secure/ischeckout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const userCheckedOutBookResponse = await fetch(url, requestOptions);
                if (!userCheckedOutBookResponse.ok) {
                    throw new Error('Something went wrong');
                }
                const userCheckedOutBookResponseJson = await userCheckedOutBookResponse.json();
                setIsCheckedOut(userCheckedOutBookResponseJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState])

    if (isLoadingBook || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (<div>
            <SpinnerLoading />
        </div>)
    }

    if (httpError) {
        return (<div>
            <p> {httpError} </p>
        </div>)
    }

    async function checkoutBook() {
        if (authState) {
            const url = `${BASEURL.url}/books/secure/checkout?bookId=${bookId}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
            const checkOutBookResponse = await fetch(url, requestOptions);
            if (!checkOutBookResponse.ok) {
                throw new Error('Something went wrong');
            }

            setIsCheckedOut(true);
        }

    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }
        if (authState) {
            const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription)
            const url = `${BASEURL.url}/reviews/secure`;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewRequestModel)
            }
            const submitReviewResponse = await fetch(url, requestOptions);
            if (!submitReviewResponse.ok) {
                throw new Error('Something went wrong');
            }
            setIsReviewLeft(true);
        }
    }

        return (
            <div>
                <div className='container d-none d-lg-block'>
                    <div className='row mt-5'>
                        <div className='col-sm-2 col-md-2'>
                            {book?.img ?
                                <img src={book?.img} width='226' height='349' alt='Book' />
                                :
                                <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='256'
                                    height='349' alt='Book' />
                            }
                        </div>
                        <div className='col-4 col-md-4 container'>
                            <div className='ml-2'>
                                <h2> {book?.title}</h2>
                                <h5 className="text-primary"> {book?.author} </h5>
                                <p className='lead'> {book?.description} </p>
                                <StarsReview rating={totalStars} size={32} />
                            </div>
                        </div>
                        <CheckoutAndReviewBox book={book} checkoutCount={currentLoanCount} isCheckedout={isCheckedout} checkoutBook={checkoutBook}
                            submitReview={submitReview} isReviewleft={isReviewLeft} mobile={false} />
                    </div>
                    <hr />
                    <LatestReviews reviews={reviews!} bookId={book?.id} mobile={false} />
                </div>
                <div className='container d-lg-none mt-5'>
                    <div className='d-flex justify-content-center align-items-center'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='256'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='mt-4'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>

                    </div>
                    <CheckoutAndReviewBox book={book} checkoutCount={currentLoanCount} isCheckedout={isCheckedout} checkoutBook={checkoutBook}
                        submitReview={submitReview} isReviewleft={isReviewLeft} mobile={true} />
                </div>
                <hr />
            </div>
        )
    }

    export default BookCheckoutPage;