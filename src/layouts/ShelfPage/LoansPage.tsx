import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { BASEURL } from "../../lib/baseUrlConfig";
import CurrentLoansModel from "../../models/CurrentLoansModel";
import SpinnerLoading from "../utils/SpinnerLoading";
import { LoansModal } from "./LoansModel";


export const LoansPage = () => {
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<CurrentLoansModel[]>([]);
    const [isLoadingLoanResponses, setIsloadingLoansResponses] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [checkout, setCheckout] = useState(true);
    const { authState } = useOktaAuth();

    useEffect(() => {
        if (authState && authState?.isAuthenticated) {
            const fetchCurrentLoans = async () => {
                const url: string = `${BASEURL.url}/books/secure/loans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const currentLoansResponse = await fetch(url, requestOptions);
                if (!currentLoansResponse.ok) {
                    throw new Error("Something went wrong");
                }

                const currentLoansJson = await currentLoansResponse.json();
                setShelfCurrentLoans(currentLoansJson)
            }
            setIsloadingLoansResponses(false);

            fetchCurrentLoans().catch((error: any) => {
                setIsloadingLoansResponses(false);
                setHttpError(error.message);
            })
        }


    }, [authState, checkout])

    if (isLoadingLoanResponses) {
        return (<div>
            <SpinnerLoading />
        </div>)
    }


    if (httpError) {
        return (<div>
            <p> {httpError} </p>
        </div>)
    }

    async function ReturnBook(bookId: number) {
        if (authState) {
            const url = `${BASEURL.url}/books/secure/returnBook?bookId=${bookId}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
            const returnResponse = await fetch(url, requestOptions);
            if (!returnResponse.ok){
                throw new Error("something went wrong");
            }
        }
        setCheckout(!checkout);
    }

    async function renewBook(bookId: number){
        if (authState) {
            const url = `${BASEURL.url}/books/secure/renew/loan?bookId=${bookId}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
            const returnResponse = await fetch(url, requestOptions);
            if (!returnResponse.ok){
                throw new Error("something went wrong");
            }
        }
        setCheckout(!checkout);
    }

    return (
        <div className="">
            {/*Desktop*/}
            <div className='d-none d-lg-block mt-2'>
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5>Current Loans: </h5>
                        {shelfCurrentLoans.map(shelfCurrentLoan => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        {
                                            shelfCurrentLoan.book?.img ?
                                                <img src={shelfCurrentLoan.book?.img} width='256' height='349' alt='Book' />
                                                :
                                                <img src={require('../../Images/BooksImages/book-luv2code-1000.png')} width='256' height='349' alt='Book' />
                                        }
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className='card-body'>
                                            <div className='mt-3'>
                                                <h4> Loan Options</h4>
                                                {shelfCurrentLoan.daysLeft > 0 &&
                                                    <p className='text-secondary'>
                                                        Due in {shelfCurrentLoan.daysLeft} days.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft === 0 &&
                                                    <p className="text-success">
                                                        Due Today.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft < 0 &&
                                                    <p className="text-danger">
                                                        Past Due by {shelfCurrentLoan.daysLeft} days.
                                                    </p>
                                                }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action" aria-current='true' data-bs-toggle='modal'
                                                        data-bs-target={`#modal${shelfCurrentLoan.book.id}`}> Manage Loan
                                                    </button>
                                                    <Link to={"search"} className='list-group-item list-group-item-action'>
                                                        Search more books?
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className='mt-3'>
                                                Help other find their adventure by reviewing your loan.
                                            </p>
                                            <Link className="btn btn-primary" to={`checkout/${shelfCurrentLoan.book.id}`}> Leave a review</Link>
                                        </div>

                                    </div>

                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoan={shelfCurrentLoan} returnBook={ReturnBook} renewBook={renewBook} mobile={false} />
                            </div>
                        ))}

                    </> :

                    <>
                        <h3 className='mt-3'>
                            Currently no loans
                        </h3>
                        <Link to={"search"} className='btn btn-primary'>
                            Search for a new book
                        </Link>
                    </>}

            </div>
            {/*Mobile*/}
            <div className='container d-lg-none mt-2'>
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5 className='mb-3'>Current Loans: </h5>
                        {shelfCurrentLoans.map(shelfCurrentLoan => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className="d-flex justify-content center align-content-center">
                                    {
                                        shelfCurrentLoan.book?.img ?
                                            <img src={shelfCurrentLoan.book?.img} width='256' height='349' alt='Book' />
                                            :
                                            <img src={require('../../Images/BooksImages/book-luv2code-1000.png')} width='256' height='349' alt='Book' />
                                    }
                                </div>
                                <div className="card d-flex mt-5 md-3">
                                    <div className='card-body container'>
                                        <div className='mt-3'>
                                            <h4> Loan Options</h4>
                                            {shelfCurrentLoan.daysLeft > 0 &&
                                                <p className='text-secondary'>
                                                    Due in {shelfCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            {shelfCurrentLoan.daysLeft === 0 &&
                                                <p className="text-success">
                                                    Due Today.
                                                </p>
                                            }
                                            {shelfCurrentLoan.daysLeft < 0 &&
                                                <p className="text-danger">
                                                    Past Due by {shelfCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action" aria-current='true' data-bs-toggle='modal'
                                                    data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}> Manage Loan
                                                </button>
                                                <Link to={"search"} className='list-group-item list-group-item-action'>
                                                    Search more books?
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className='mt-3'>
                                            Help other find their adventure by reviewing your loan.
                                        </p>
                                        <Link className="btn btn-primary" to={`checkout/${shelfCurrentLoan.book.id}`}> Leave a review</Link>
                                    </div>

                                </div>


                                <hr />
                                <LoansModal shelfCurrentLoan={shelfCurrentLoan} returnBook={ReturnBook} renewBook={renewBook} mobile={true} />
                            </div>
                        ))}

                    </> :

                    <>
                        <h3 className='mt-3'>
                            Currently no loans
                        </h3>
                        <Link to={"search"} className='btn btn-primary'>
                            Search for a new book
                        </Link>
                    </>}

            </div>




        </div>
    )
}
export default LoansPage