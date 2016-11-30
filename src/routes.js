import React from 'react'
import {Route, IndexRoute} from 'react-router'
//import {Route, IndexRedirect} from 'react-router'

import App from './containers/App'
import Admin from './components/Admin'
import About from './components/About'
import Home from './components/Home'
import ValidateEmail from './containers/ValidateEmail'
import NotFound from './components/NotFound'
import Contacts from './components/Contacts'
import Products from './components/Products'
import LoginPage from './containers/LoginPage'
import CheckEmail from './containers/CheckEmail'
import News from './components/news'
import NewsPage from './components/NewsPage'
import SignupPage from './containers/SignupPage'
import Orders from './containers/Orders'
import requireIdentification from './containers/IdentifiedComponent'
//import requireAuthentication from './containers/AuthenticatedComponent'


export const routes = (
  <div>
    <Route path='/' component={App}>
      <IndexRoute component={Home}/>
      {/*}<IndexRedirect to='list' />*/}
      <Route path='/news(/page/:page)' component={News}/>
      <Route path='/news/:id' component={NewsPage}/>
      <Route path='/admin' component={Admin}  onEnter={Admin.onEnter}/>
      <Route path='/products(/category/:category(/:items(/page/:page)))' component={Products}/>
      <Route path='contacts' component={Contacts}/>
      <Route path='about' component={About} />
      <Route path='login' component={LoginPage} />
      <Route path='orders' component= {Orders}/>
      <Route path='signup' component={SignupPage}/>
      <Route path='validateEmail' component= {requireIdentification(ValidateEmail)}/>
      <Route path='/verifyEmail/:token' component={CheckEmail}/>
    </Route>
    <Route path='*' component={NotFound} />
  </div>
)
//requireAuthentication
//<Route path='/news/page/:page' component={News}/>
