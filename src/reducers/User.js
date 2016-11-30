//import jwtDecode from 'jwt-decode';

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
} from '../constants/User'

const initialState = {
    token: null,
    user: null,
    status: null,
    error: null,
    statusText: null,
    loading: false,
    identified: false,
    authenticated: false
/*

    isAuthenticated: false,

    statusText: null,
    success: true*/
};

export default function userstate(state=initialState, action) {
  switch (action.type) {
//LOGIN
    case LOGIN_REQUEST:
      return {...state,
              token: null,
              user: null,
              authenticated: false,
              identified: false,
              //emailVerified: false,
              error: null,
              statusText: null,
              loading: true};  //return {...state, isAuthenticating: true, statusText: null}
    case LOGIN_SUCCESS:
      return {...state,
              token: action.payload.token,
              user: action.payload.user,
              identified: true,
              authenticated: action.payload.authenticated,
              //emailVerified: true,
              error: null,
              statusText: action.payload.statusText,
              loading: false};
    case LOGIN_FAIL:
      return {...state,
              token: null,
              user: null,
              identified: false,
              authenticated: false,
              //emailVerified: false,
              error: action.payload.error,
              statusText: `Ошибка аутентификации: ${action.payload.status} ${action.payload.statusText}.`,
              loading: false};
  /*case ACCOUNT_NEED_VALIDATE:
    return {...state,
            token:  action.payload.token,
            user: action.payload.user,
            authenticated: false,
            //emailVerified: true,
            error: null,
            statusText: action.payload.statusText,
            loading: false};*/

//LOGOUT
    case LOGOUT_SUCCESS:
      return {...state,
              token: null,
              user: null,
              //status: 'logout',
              identified: false,
              authenticated: false,
              error: null,
              statusText: 'Выход успешно завершен.',
              loading: false};

//VALIDATE_EMAIL
    case VALIDATE_EMAIL_REQUEST:
      return {...state,
              //status: 'validate_email',
              token: null,
              user: null,
              identified: false,
              authenticated: false,
              error: null,
              statusText: null,
              loading: true};
    case VALIDATE_EMAIL_SUCCESS:
      return { ...state,
              token: action.payload.token,
              user: action.payload.user,
              //status:'authenticated',
              identified: true,
              authenticated: true,
              error:null,
              statusText: 'Email подтвержден!',
              loading: false};
    case VALIDATE_EMAIL_FAIL:
      return { ...state,
              //status: 'validate_email',
              token: null,
              user: null,
              identified: false,
              authenticated: false,
              error:action.payload.error,
              statusText: `Ошибка подтверждения Email: ${action.payload.status} ${action.payload.statusText}.`,
              loading: false};

//SIGNUP
    case SIGNUP_REQUEST:
      return { ...state,
              token: null,
              user: null,
              identified: false,
              authenticated: false,
              error:null,
              statusText: null,
              loading: true};
    case SIGNUP_SUCCESS:
      return { ...state,
               token: action.payload.token,
               user: action.payload.user,
               identified: true,
               authenticated: false,
               error:null,
               statusText: action.payload.statusText,
               loading: false};
    case SIGNUP_FAIL:
      return { ...state,
               token: null,
               user: null,
               identified: false,
               authenticated: false,
               error:action.payload.error,
               statusText: `Ошибка регистрации: ${action.payload.status} ${action.payload.statusText}.`,
               loading: false};

//ME_FROM_TOKEN
    case ME_FROM_TOKEN_REQUEST:
      return { ...state,
               token: null,
               user: null,
               identified: false,
               authenticated: false,
               error:null,
               statusText: null,
               loading: true};
   case ME_FROM_TOKEN_SUCCESS:
     return { ...state,
             token: action.payload.token,
             user: action.payload.user,
             identified: true,
             authenticated: action.payload.authenticated,
             error:null,
             statusText: action.payload.statusText,
             loading: false};
   case ME_FROM_TOKEN_FAIL:
     return { ...state,
             token: null,
             user: null,
             identified: false,
             authenticated: false,
             error:action.payload.error,
             statusText: `Ошибка чтения token: ${action.payload.status} ${action.payload.statusText}.`,
             loading: false};


   case RESET_TOKEN:
     return { ...state,
             token: null,
             user: null,
             identified: false,
             authenticated: false,
             error:null,
             statusText: 'Token reset',
             loading: false};


    default:
      return state
  }
}
