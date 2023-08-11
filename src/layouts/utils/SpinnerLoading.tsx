import React from "react";

function SpinnerLoading(){
    return (
        <div className="container m-7 d-flex justify-content-center align-items-center text-center" style={{height: 500}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                    Loading...
                </span>
            </div>
        </div>
    )
};

export default SpinnerLoading;