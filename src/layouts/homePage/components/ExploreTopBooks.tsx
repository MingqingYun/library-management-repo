import React from 'react';
import { Link } from 'react-router-dom';
function ExploreTopBooks(){
    return(
        <div className="p-5 mb-4 bg_dark header">
            <div className="container_fluid py-5 text-white d-flex justify-content-center align-items-center">
                <div>
                    <h1 className="display-5 fw-bold"> Find your next adventure</h1>
                    <p className="col-md-8 fs-4">Where would you like to go next? </p>
                    <Link className="btn btn-primary btn-lg" type="button" to='/search'>Explore top books</Link>
                </div>
                
            </div>
        </div>
        // <div className="img-fluid w-100 text-center bg-image" style={{backgroundImage: 'url("https://mdbcdn.b-cdn.net/img/new/slides/041.webp")', height: 'auto'}}>
        //     <div className="mask" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)', height:'400px'}}>
        //         <div className="d-flex justify-content-center align-items-center h-100">
        //             <div className="text-white">
        //             <h1 className="mb-3">Heading</h1>
        //             <h4 className="mb-3">Subheading</h4>
        //             <a className="btn btn-outline-light btn-lg" href="#!" role="button">Call to action</a>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
}

export default ExploreTopBooks;