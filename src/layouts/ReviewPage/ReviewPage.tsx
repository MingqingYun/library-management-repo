import React from "react"
import ReviewModel from "../../models/ReviewModel";
import { Review } from "../utils/Review";
import { useEffect, useState } from "react";
import SpinnerLoading from "../utils/SpinnerLoading";
import { Pagination } from "../utils/Pagination";
import { BASEURL } from "../../lib/baseUrlConfig";

export const ReviewPage = () => {

    const bookId = (window.location.pathname).split('/')[2];

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${BASEURL.url}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage-1}&size=${reviewsPerPage}`;
            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('something went wrong about fetch reviews');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseDataReviews = responseJsonReviews._embedded.reviews;
            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseDataReviews) {
                loadedReviews.push({
                    id: responseDataReviews[key].id,
                    userEmail: responseDataReviews[key].userEmail,
                    date: responseDataReviews[key].date,
                    rating: responseDataReviews[key].rating,
                    bookId: responseDataReviews[key].bookId,
                    reviewDescription: responseDataReviews[key].reviewDescription
                })

            }
            console.log(responseJsonReviews);
            setReviews(loadedReviews);
            setIsLoadingReview(false);
        }
        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [currentPage])

    if (isLoadingReview) {
        return (<div>
            <SpinnerLoading />
        </div>)
    }

    if (httpError) {
        return (<div>
            <p> {httpError} </p>
        </div>)
    }

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container m-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} reviews.
            </p>
            <div className='row'>
                {reviews.map(eachReview => (
                    <Review review={eachReview} key={eachReview.id} />
                ))}
            </div>

            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }


        </div>)

}

export default ReviewPage;