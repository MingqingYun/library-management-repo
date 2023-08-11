import { useOktaAuth } from "@okta/okta-react";
import React from "react"
import { Link } from "react-router-dom";

function LibraryServices() {
    const { authState } = useOktaAuth();
    return (
        <div className='container my-5'>
            <div className='row p-4 align-items-center boarder shadow-lg'>
                <div className='col-lg-7 p-3'>
                    <h1 className="display-4 fw-bold"> Can't find what you're looking for?</h1>
                    <p className='lead'> Please sign up here!</p>
                    {authState?.isAuthenticated ?
                        <Link type='button' className='btn main-color text-white' to='/messages'> Library Services</Link>
                        :
                        <Link className='btn main-color btn-lg text-white' to='/login'>Sign up</Link>
                    }
                </div>
                <div className='col-lg-4 offset-lg-1 shadow-lg lost-image'></div>
            </div>

        </div>
    );
}

export default LibraryServices;