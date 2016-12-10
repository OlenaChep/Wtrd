/*globals Promise:true*/
import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from '../utils';
import {
  LOAD_ORDERS_REQUEST,
  LOAD_ORDERS_FAIL,
  LOAD_ORDERS_SUCCESS,
  LOAD_ORDER_SPEC_REQUEST,
  LOAD_ORDER_SPEC_FAIL,
  LOAD_ORDER_SPEC_SUCCESS,
  INVALIDATE_ORDER_SPEC
} from '../constants/Order';
import {ROOT_URL} from '../constants/Common';


export function loadOrdersRequest(userId) {
  return {
    type: LOAD_ORDERS_REQUEST,
    userId
  }
}

export function loadOrdersFailure(userId, error) {
  return {
    type: LOAD_ORDERS_FAIL,
    userId,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loadOrdersSuccess(userId, payload) {
  return {
    type: LOAD_ORDERS_SUCCESS,
    userId,
    payload: {
      items: payload.items,
      statusText: payload.statusText,
      receivedAt: Date.now()
    }
  }
}

export function loadOrders(userId, token) {
  let config = {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  }
  return function(dispatch) {
    dispatch(loadOrdersRequest(userId));
    if (!token || token === '' || !userId) {
      dispatch(loadOrdersFailure(userId, {
                        response: {
                        status: 403,
                        statusText: 'Пожалуйста залогиньтесь'}
                }));
      return new Promise(() => {
          throw new Error('Пожалуйста залогиньтесь');
      });
    }

    return fetch(ROOT_URL + '/orders', config)
          .then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
             dispatch(loadOrdersSuccess(userId, {
               items: response,
               statusText: 'Заказы загружены'
             }))
          })
          .catch(error => {
             parseJSON(error.response).then(function(data) {
                  dispatch(loadOrdersFailure(userId, {
                    response: {
                      status: error.response.status,
                      statusText: data.message}
                  }));
                  throw new Error(data.message);
             })
          })
  }
}

const shouldLoadOrders = (state, userId) => {
  const orders = state.orders[userId]
  if (!orders) {
    return true
  }
  /*if (orders.loading) {
    return false
  }*/
  return false;
}

export const loadOrdersIfNeeded = (userId, token) => (dispatch, getState) => {
  if (shouldLoadOrders(getState(), userId)) {
    return dispatch(loadOrders(userId, token))
                   .catch(() => {});
  }
}

export function loadOrderSpecRequest(orderId) {
  return {
    type: LOAD_ORDER_SPEC_REQUEST,
    orderId
  }
}

export function loadOrderSpecFailure(orderId, error) {
  return {
    type: LOAD_ORDER_SPEC_FAIL,
    orderId,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loadOrderSpecSuccess(orderId, payload) {
  return {
    type: LOAD_ORDER_SPEC_SUCCESS,
    orderId,
    payload: {
      items: payload.items,
      statusText: payload.statusText
    }
  }
}

export function InvalidateOrderSpec(orderId) {
  return {
    type: INVALIDATE_ORDER_SPEC,
    orderId
  }
}

const shouldLoadOrderSpec = (state, orderId) => {
  const orderSpec = state.orderSpec[orderId]
  if (!orderSpec) {
    return true
  }
  if (orderSpec.loading) {
    return false
  }
  return orderSpec.invalide;
}

export const loadOrderSpecIfNeeded = (orderId, token) => (dispatch, getState) => {
  if (shouldLoadOrderSpec(getState(), orderId)) {
    return dispatch(loadOrderSpec(orderId, token))
                   .catch(() => {});
  }
}

export function loadOrderSpec(orderId, token) {
  let config = {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  }
  return function(dispatch) {
    dispatch(loadOrderSpecRequest(orderId));
    if (!token || token === '') {
      dispatch(loadOrderSpecFailure(orderId, {
                        response: {
                        status: 403,
                        statusText: 'Пожалуйста залогиньтесь'}
                }));
      return new Promise(() => {
                    throw new Error('Пожалуйста залогиньтесь');
                 });
    }

    return fetch(ROOT_URL + '/orders/' + orderId + '/order_spec', config)
          .then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
             dispatch(loadOrderSpecSuccess(orderId, {
               items: response,
               statusText: 'Спецификация загружена'
             }))
          })
          .catch(error => {
             parseJSON(error.response).then(function(data) {
                  dispatch(loadOrderSpecFailure(orderId, {
                    response: {
                      status: error.response.status,
                      statusText: data.message}
                  }));
                  throw new Error(data.message);
             })
          })
  }
}

export const InvalidateAllOrderSpec = (userId)  => (dispatch, getState) => {
  let state = getState();
  if (state.orders && state.orders[userId] && state.orders[userId].items) {
     let orders = state.orders[userId].items;
     orders.forEach(function(item) {
       let orderId = item.id;
       if (orderId && state.orderSpec && state.orderSpec[orderId]) {
         dispatch(InvalidateOrderSpec(orderId));
       }
     });
  }
}
