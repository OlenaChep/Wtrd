import fetch from 'isomorphic-fetch';
//import jwtDecode from 'jwt-decode';
import { checkHttpStatus, parseJSON } from '../utils';
import {AUTH_ROOT_URL} from '../constants/Common';

import {
  RESEND_VALIDATION_EMAIL_REQUEST,
  RESEND_VALIDATION_EMAIL_SUCCESS,
  RESEND_VALIDATION_EMAIL_FAIL
} from '../constants/Email';

export function resendValidationEmailRequest() {
  return {
    type: RESEND_VALIDATION_EMAIL_REQUEST
  }
}

export function resendValidationEmailFail(error) {
  return {
    type: RESEND_VALIDATION_EMAIL_FAIL,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function resendValidationEmailSuccess() {
  return {
    type:  RESEND_VALIDATION_EMAIL_SUCCESS
  }
}

export function resendValidationEmail(token) {

  let config = {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  }
//alert('aaa');
return function(dispatch) {
  dispatch(resendValidationEmailRequest());
  if (!token || token === '') {
    return dispatch(resendValidationEmailFail({
                      response: {
                      status: 403,
                      statusText: 'Пожалуйста залогиньтесь'}
                    }));
  }

  return fetch(AUTH_ROOT_URL + '/resendValidationEmail', config)
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(response => {
           if (response.success) {
              dispatch(resendValidationEmailSuccess());
           } else {
              dispatch(resendValidationEmailFail({
                         response: {
                         status: 403,
                         statusText: response.message}
                       }));
          }
        })
        .catch(error => {
           parseJSON(error.response).then(function(data) {
                dispatch(resendValidationEmailFail({
                  response: {
                    status: error.response.status,
                    statusText: data.message}
                }))
           })
        })
}}
