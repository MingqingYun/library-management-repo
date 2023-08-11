import React from 'react';
import './App.css';
import Header from './layouts/headerAndFooter/header';
import HomePage from './layouts/homePage/HomePage';
import Footer from './layouts/headerAndFooter/footer';
import SearchBooksPage from './layouts/searchBookPage/SearchBooksPage';
import { Redirect, Route, Switch, useHistory} from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import {OktaAuth} from '@okta/okta-auth-js';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewPage } from './layouts/ReviewPage/ReviewPage';
import ShelfPage from './layouts/ShelfPage/ShelfPage';
import MessagesPage from './layouts/MessagesPage/MessagesPage';
import AdminPage from './layouts/AdminPage/AdminPage';

const oktaAuth = new OktaAuth(oktaConfig);

function App() {
  const customerAuthHandeler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOrigionalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth = {oktaAuth} restoreOriginalUri = {restoreOrigionalUri} onAuthRequired={customerAuthHandeler}>
      <Header />
      <div className='flex-grow-1'> 
      <Switch>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>
        <Route path='/home'>
          <HomePage />
        </Route>
        <Route path='/search'>
          <SearchBooksPage />
        </Route>

        <Route path='/checkout/:bookId'>
          <BookCheckoutPage />
        </Route>
        <Route path = '/reviewlist/:bookId'>
          <ReviewPage />
        </Route>
        <SecureRoute path = '/shelf'>
          <ShelfPage />
        </SecureRoute>
        <SecureRoute path = '/messages'>
          <MessagesPage />
        </SecureRoute>
        <SecureRoute path = '/admin'>
          <AdminPage />
        </SecureRoute>
        <Route path='/login' render = {() => <LoginWidget config = {oktaConfig} /> } />
        <Route path='/login/callback' component={LoginCallback} />
        

      </Switch>
      </div>
      <Footer />
      </Security>
    </div>

  );
}

export default App;
function toRelativeUrl(arg0: any, origion: any): any {
  throw new Error('Function not implemented.');
}

