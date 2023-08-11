import { useOktaAuth } from "@okta/okta-react";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import AddNewBook from "./component/AddNewBook";
import { AdminMessages } from "./component/AdminMessages";
import { ChangeQuantityOfBooks } from "./component/ChangeQuantityOfBooks";


export const AdminPage=()=>{
    const {authState} = useOktaAuth();
    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    function addBookClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
    }
    function changeQuantityOfBooksClickFunction(){
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false);
    }

    function messagesClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true);
    }

    if (authState?.accessToken?.claims.userType === undefined){
        return <Redirect to='/home' />
    }



    return(
        <div className="container ">
            <div className='mt-5'>
                <h3>Manage Library</h3>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button onClick={addBookClickFunction} className="nav-link active" id="nav-add-new-book-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-add-new-book" type="button" role="tab" aria-controls="nav-add-new-book"
                            aria-selected="true">
                            Add new book
                        </button>

                        <button onClick={changeQuantityOfBooksClickFunction} className="nav-link" id="nav-change-quantity-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-change-quantity" type="button" role="tab" aria-controls="nav-change-quantity"
                            aria-selected="false">
                            Change quantity
                        </button>

                        <button onClick={messagesClickFunction} className="nav-link" id="nav-messages-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                            aria-selected="false">
                            Messages
                        </button>
                    </div>
                    <div className='tab-content' id='nav-tabContent'>
                        <div className='tab-pane fade show active' id='nav-add-new-book' role='tabpanel' aria-labelledby='nav-add-new-book-tab'>
                            <h4>add new book:</h4>
                            <AddNewBook />
                        </div>
                        <div className='tab-pane fade' id='nav-change-quantity' role='tabpanel' aria-labelledby='nav-change-quantity-tab'>
                            {changeQuantityOfBooksClick?<ChangeQuantityOfBooks />:<></>}
                            
                        </div>
                        <div className='tab-pane fade' id='nav-messages' role='tabpanel' aria-labelledby='nav-messages-tab'>
                            {messagesClick?<AdminMessages /> : <></>}
                            
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default AdminPage;