import React from "react"
import LoansPage from "./LoansPage";
import { HistoryPage } from "./HistoryPage";

export const BookCheckoutPage = () => {
    
    return (
        <div className="container ">
            <div className='mt-3'>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button className="nav-link active" id="nav-loans-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-loans" type="button" role="tab" aria-controls="nav-loans"
                            aria-selected="true">
                            Loans
                        </button>

                        <button className="nav-link" id="nav-history-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-history" type="button" role="tab" aria-controls="nav-history"
                            aria-selected="false">
                            Your History
                        </button>
                    </div>
                    <div className='tab-content' id='nav-tabContent'>
                        <div className='tab-pane fade show active' id='nav-loans' role='tabpanel' aria-labelledby='nav-loans-tab'>
                            <h4>Current Loans:</h4>
                            <LoansPage/ >
                        </div>
                        <div className='tab-pane fade' id='nav-history' role='tabpanel' aria-labelledby='nav-history-tab'>
                            <h4>Checkout History</h4>
                            <HistoryPage />
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default BookCheckoutPage
