import {
  RESEND_VALIDATION_EMAIL_REQUEST,
  RESEND_VALIDATION_EMAIL_SUCCESS,
  RESEND_VALIDATION_EMAIL_FAIL
} from '../constants/Email'

const initialState = {
    error: null,
    statusText: null,
    loading: false
};

export default function emailstate(state=initialState, action) {
  switch (action.type) {
  //LOGIN
    case RESEND_VALIDATION_EMAIL_REQUEST:
      return {...state,
              error: null,
              statusText: null,
              loading: true};
   case RESEND_VALIDATION_EMAIL_SUCCESS:
      return {...state,
              error: null,
              statusText: 'Письмо отправлено',
              loading: false};
   case RESEND_VALIDATION_EMAIL_FAIL:
      return {...state,
              error: action.payload.error,
              statusText:  `Ошибка отправки письма: ${action.payload.status} ${action.payload.statusText}.`,
              loading: false};
   default:
     return state;
  }
}
