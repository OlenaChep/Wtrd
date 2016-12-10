//import { pushState } from 'redux-router';
import fetch from 'isomorphic-fetch';
import jwtDecode from 'jwt-decode';
import { checkHttpStatus, parseJSON } from '../utils';
import {AUTH_ROOT_URL} from '../constants/Common';

import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  VALIDATE_EMAIL_REQUEST,
  VALIDATE_EMAIL_SUCCESS,
  VALIDATE_EMAIL_FAIL,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  ME_FROM_TOKEN_REQUEST,
  ME_FROM_TOKEN_SUCCESS,
  ME_FROM_TOKEN_FAIL,
  RESET_TOKEN
} from '../constants/User';

import {
  ROUTING
} from '../constants/Routing';

export function loginUserRequest() {
  return {
    type: LOGIN_REQUEST
  }
}

export function redirect(nextUrl = '/') {
  return(dispatch) => {
    dispatch({type: ROUTING,
              payload: {
                         method: 'push', //или, например, replace
                         nextUrl: nextUrl
                       }
            });
  }
}

export function loginUserSuccess(payload) {
  localStorage.setItem('token', payload.token);
  return {
    type: LOGIN_SUCCESS,
    payload: {
      token: payload.token,
      user: payload.user,
      authenticated: payload.authenticated,
      statusText: payload.statusText
    }
  }
}

export function loginUserDone(payload) {
  return (dispatch) => {
    dispatch(loginUserSuccess(payload));
    if (!payload.authenticated) {
      dispatch(redirect('/validateEmail'));
      /*dispatch({type: ROUTING,
                  payload: {
                             method: 'push', //или, например, replace
                             nextUrl: '/validateEmail'
                           }
                 });*/
    }
  }
}


export function loginUserFailure(error) {
  localStorage.removeItem('token');
  return {
    type: LOGIN_FAIL,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function logoutUser() {
  localStorage.removeItem('token');
  return {
    type: LOGOUT_SUCCESS
  }
}

export function logoutAndRedirect(nextUrl='/') {

    return (dispatch) => {
        dispatch(logoutUser());
        dispatch(redirect(nextUrl));
        /*dispatch({type: ROUTING,
                    payload: {
                               method: 'push', //или, например, replace
                               nextUrl: redirect
                             }
                   });*/
    }
}

export function loginUser(name, password/*, redirect='/'*/) {

  let config = {
     method: 'POST',
     credentials: 'include',
     body: JSON.stringify({name: name, password: password}),
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      }
    }

    return function(dispatch) {
      dispatch(loginUserRequest());
      return fetch(AUTH_ROOT_URL + '/login', config)
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                      //проверка валидности ключа
                      jwtDecode(response.token);
                      dispatch(loginUserDone({token: response.token,
                          user: response.user,
                          authenticated: Boolean(response.user.isVerified),
                          statusText: response.user.isVerified?
                            'Добро пожаловать ' + response.user.name + '!' :
                            'На Ваш email было выслано письмо. Для завершения действия перейдите по ссылке в письме.'
                        }));

                  /*  dispatch({type: ROUTING,
                              payload: {
                                         method: 'push', //или, например, replace
                                         nextUrl: redirect
                                       }
                             })*/
                    //dispatch(pushState(null, redirect));

                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                          status: 403,
                          statusText: 'Инвалидный ключ'
                        }
                    }));
                    /*dispatch({type: ROUTING,
                                payload: {
                                           method: 'push', //или, например, replace
                                           nextUrl: '/'
                                         }
                               });*/
                }
            })
            .catch(error => {
               parseJSON(error.response).then(function(data) {
                    dispatch(loginUserFailure({
                      response: {
                        status: error.response.status,
                        statusText: data.message
                      }}))
               })
            })
    }
}

export function signupUserRequest() {
  return {
    type: SIGNUP_REQUEST
  }
}

export function signupUserFailure(error) {
  localStorage.removeItem('token');
  return {
    type: SIGNUP_FAIL,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function signupUserSuccess(payload) {
  localStorage.setItem('token', payload.token);
  return {
    type: SIGNUP_SUCCESS,
    payload: {
      token: payload.token,
      user: payload.user,
      statusText: payload.statusText
    }
  }
}

export function signupUser(name, password, email) {
  let config = {
     method: 'POST',
     credentials: 'include',
     body: JSON.stringify({name: name, password: password, email: email}),
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      }
    }
    return function(dispatch) {
      dispatch(signupUserRequest());
      return fetch(AUTH_ROOT_URL + '/signup', config)
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
              try {
                  //проверка валидности ключа
                jwtDecode(response.token);
              } catch (e) {
                dispatch(signupUserFailure({
                    response: {
                    status: 403,
                    statusText: 'Инвалидный ключ'
                  }
                }));
              }
              dispatch(signupUserSuccess({
                token: response.token,
                user: response.user,
                statusText: response.success?
                  response.user.name + ' на Ваш Email было выслано письмо. Подтвердите регистрацию, перейдя по ссылке в письме.':
                  response.message
               }));
               dispatch(redirect('/validateEmail'));
              /*dispatch({type: ROUTING,
                              payload: {
                                         method: 'push', //или, например, replace
                                         nextUrl: '/validateEmail'
                                       }
              }); */
          })
         .catch(error => {
           parseJSON(error.response).then(function(data) {
                dispatch(signupUserFailure({
                  response: {
                  status: error.response.status,
                  statusText: data.message
                }}))
           })
        })
     }
}

export function validateEmailRequest() {
  return {
    type: VALIDATE_EMAIL_REQUEST
  }
}

export function validateEmailFailure(error) {
  localStorage.removeItem('token');
  return {
    type: VALIDATE_EMAIL_FAIL,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function validateEmailSuccess(payload) {
  localStorage.setItem('token', payload.token);
  return {
    type:  VALIDATE_EMAIL_SUCCESS,
    payload: {
      token: payload.token,
      user: payload.user
    }
  }
}

export function validateEmail(token) {
  let config = {
     method: 'POST',
     credentials: 'include',
     //body: JSON.stringify({name: name, password: password, email: email}),
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      }
    }
    return function(dispatch) {
      dispatch(validateEmailRequest());
      return fetch(AUTH_ROOT_URL + '/validateEmail/' + token, config)
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
              try {
                  //проверка валидности ключа
                  jwtDecode(response.token);
                  dispatch(validateEmailSuccess({token: response.token, user: response.user}));
                  //перевод на страницу ???
              } catch (e) {
                dispatch(validateEmailFailure({
                    response: {
                    status: 403,
                    statusText: 'Инвалидный ключ'
                  }
                }));
            }
          })
         .catch(error => {
           parseJSON(error.response).then(function(data) {
                dispatch(validateEmailFailure({
                  response: {
                  status: error.response.status,
                  statusText: data.message
                }}))
           })
        })
     }
}

export function meFromTokenRequest() {
  return {
    type: ME_FROM_TOKEN_REQUEST
  }
}

export function meFromTokenFailure(error) {
  localStorage.removeItem('token');
  return {
    type: ME_FROM_TOKEN_FAIL,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function meFromTokenSuccess(payload) {
  localStorage.setItem('token', payload.token);
  return {
    type:  ME_FROM_TOKEN_SUCCESS,
    payload: {
      token: payload.token,
      user: payload.user,
      authenticated: payload.authenticated,
      statusText: payload.statusText
    }
  }
}

export function meFromTokenDone(payload) {
  return (dispatch) => {
    dispatch(meFromTokenSuccess(payload));
    if (!payload.authenticated) {
      dispatch(redirect('/validateEmail'));
      /*dispatch({type: ROUTING,
                  payload: {
                             method: 'push', //или, например, replace
                             nextUrl: '/validateEmail'
                           }
                 });*/
    }
  }
}

export function meFromToken(token) {
  let config = {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  }
  return function(dispatch) {
    dispatch(meFromTokenRequest());
    if (!token || token === '') {
      return dispatch(meFromTokenFailure({
                        response: {
                        status: 403,
                        statusText: 'Пустой ключ'}
                      }));
    }
    return fetch(AUTH_ROOT_URL + '/meFromToken', config)
          .then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
               try {
                   //проверка валидности ключа
                   jwtDecode(response.token);
                   dispatch(meFromTokenDone({token: response.token,
                       user: response.user,
                       authenticated: Boolean(response.user.isVerified),
                       statusText: response.user.isVerified?
                         'Добро пожаловать ' + response.user.name + '!' :
                         'На Ваш email было выслано письмо. Для завершения действия перейдите по ссылке в письме.'
                     }));
               } catch (e) {
                 dispatch(meFromTokenFailure({
                     response: {
                     status: 403,
                     statusText: 'Инвалидный ключ'
                   }
                 }));
               }
          })
          .catch(error => {
             parseJSON(error.response).then(function(data) {
                  dispatch(meFromTokenFailure({
                    response: {
                      status: error.response.status,
                      statusText: data.message}
                  }))
             })
          })
  }
}

export function resetToken() {//used for logout
  localStorage.removeItem('token');
  return {
    type: RESET_TOKEN
  };
}


/* eslint-enable no-unused-vars */
