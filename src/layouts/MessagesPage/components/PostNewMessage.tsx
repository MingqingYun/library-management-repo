import React, { useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import MessageModel from "../../../models/MessageModel";
import { BASEURL } from "../../../lib/baseUrlConfig";

export const PostNewMessage = () => {
    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestions] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);


    async function postMessage() {

        const url: string = `${BASEURL.url}/messages/secure/add/message`
        if (authState && authState.isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };
            const postResponse = await fetch(url, requestOptions);
            if (!postResponse.ok) {
                throw new Error('Something went wrong');
            }

            setTitle('');
            setQuestions('');
            setDisplaySuccess(true);
            setDisplayWarning(false);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }

    }





    return (
        <div className='card mt-3'>

            <div className='card-header'>
                Ask question to admin
            </div>

            <div className='card-body'>
                <form method='POST'>
                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled out.
                        </div>
                    }
                    {displaySuccess &&
                        <div className='alert alert-success' role='alert'>
                            Question added successfully
                        </div>
                    }
                    <div className='mb-3'>
                        <label className="form-label">
                            Title
                        </label>
                        <input type='text' className="form-control" id='exampleFromControlInput1'
                            placeholder="Title" onChange={e => setTitle(e.target.value)} value={title} />
                    </div>

                    <div className='mb-3'>
                        <label className="form-label">
                            Question
                        </label>
                        <textarea className="form-control" id='exampleFormControlTextarea1' rows={3}
                            onChange={e => setQuestions(e.target.value)} value={question} >

                        </textarea>
                    </div>
                    <div>
                        <button onClick={postMessage} type='button' className='btn btn-primary mt-3'>
                            Submit Question
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );

}