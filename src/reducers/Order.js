import {
  LOAD_ORDERS_REQUEST,
  LOAD_ORDERS_FAIL,
  LOAD_ORDERS_SUCCESS,
  LOAD_ORDER_SPEC_REQUEST,
  LOAD_ORDER_SPEC_FAIL,
  LOAD_ORDER_SPEC_SUCCESS,
  INVALIDATE_ORDER_SPEC
} from '../constants/Order'

const initialState = {
    items: [],
    loading: false,
    error: null,
    statusText: null
};

function orders(state=initialState, action) {
  switch (action.type) {

    case LOAD_ORDERS_REQUEST:
      return {...state,
              loading: true,
              error: null,
              statusText: null};
    case LOAD_ORDERS_SUCCESS:
      return {...state,
              loading: false,
              error: null,
              statusText: action.payload.statusText,
              items: action.payload.items};
     case LOAD_ORDERS_FAIL:
       return {...state,
               loading: false,
               error: action.payload.error,
               statusText: `Ошибка чтения заказов: ${action.payload.status} ${action.payload.statusText}.`};

     default:
       return state
  }
}

const initialSpecState = {
    items: [],
    loading: false,
    invalide: false,
    error: null,
    statusText: null
};


function orderSpec(state=initialSpecState, action) {
  switch (action.type) {

    case LOAD_ORDER_SPEC_REQUEST:
      return {...state,
              loading: true,
              invalide: false,
              error: null,
              statusText: null};
    case LOAD_ORDER_SPEC_SUCCESS:
      return {...state,
              loading: false,
              error: null,
              statusText: action.payload.statusText,
              items: action.payload.items,
              invalide: false,
              lastUpdated: action.payload.receivedAt
            };
     case LOAD_ORDER_SPEC_FAIL:
       return {...state,
               loading: false,
               error: action.payload.error,
               statusText: `Ошибка чтения заказов: ${action.payload.status} ${action.payload.statusText}.`,
               invalide: false
             };
     case INVALIDATE_ORDER_SPEC:
       return {...state,
               loading: false,
               invalide: true
             };

     default:
       return state
  }
}

export function ordersState(state = {}, action) {
  switch (action.type) {
    case LOAD_ORDERS_REQUEST:
    case LOAD_ORDERS_SUCCESS:
    case LOAD_ORDERS_FAIL:
      return Object.assign({}, state, {
        [action.userId]: orders(state[action.userId], action)
      })
    default:
      return state
  }
}

export function orderSpecState(state = {}, action) {
  switch (action.type) {
    case LOAD_ORDER_SPEC_REQUEST:
    case LOAD_ORDER_SPEC_SUCCESS:
    case LOAD_ORDER_SPEC_FAIL:
    case INVALIDATE_ORDER_SPEC:
      return Object.assign({}, state, {
        [action.orderId]: orderSpec(state[action.orderId], action)
      })
    default:
      return state
  }
}
