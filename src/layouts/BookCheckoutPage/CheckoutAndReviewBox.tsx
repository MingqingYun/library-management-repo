import { Link } from "react-router-dom"
import BookModel from "../../models/BookModel"
import { useOktaAuth } from "@okta/okta-react";
import { LeaveAReview } from "../utils/LeaveReview";

export const CheckoutAndReviewBox: React.FC<{
    book: BookModel | undefined, checkoutCount: number, isCheckedout: boolean, checkoutBook: any,
    submitReview:any, isReviewleft: boolean, mobile: boolean
}> = (props) => {
    const { authState } = useOktaAuth();

    function reviewRender() {
        if (authState && authState?.isAuthenticated && !props.isReviewleft) {
            return (<LeaveAReview submitReview={props.submitReview} />)
        } else if (authState && authState?.isAuthenticated && props.isReviewleft) {
            return (<p><b>Thank you for your review</b></p>)
        }
        return (<div><hr /><p>Sign in to be able to leave a review.</p></div>)
    }

    function buttenRender() {
        if (authState && authState?.isAuthenticated) {
            if (!props.isCheckedout && props.checkoutCount < 5) {
                return (<button onClick={() => props.checkoutBook()} className='btn btn-success btn-lg'>Checkout</button>)
            } else if (props.isCheckedout) {
                return (<p><b>Book checked out. Enjoy!</b></p>)
            } else if (!props.isCheckedout) {
                return (<p className='text-danger'> Too many books checked out.</p>)
            }
        }
        return (<Link type='button' className='btn btn-success btn-lg' to='/login'>Sign in</Link>)
    }
    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.checkoutCount}/5</b>
                        books checked out by me
                    </p>
                    <hr />

                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className="text_success">
                            Available
                        </h4>
                        :
                        <h4 className='text_danger'>
                            Wait List
                        </h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies}</b>
                            copies
                        </p>
                        <p className='col-6 lead'>
                            <b>{props.book?.copiesAvailable}</b>
                            available
                        </p>
                    </div>
                </div>
                {buttenRender()}
                <hr />
                <p className='mt-3'>
                    This number can change until placing order has been completed
                </p>
                
                {reviewRender()}
                
            </div>
        </div>
    )
}

export default CheckoutAndReviewBox;