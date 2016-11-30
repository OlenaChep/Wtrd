import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from '../utils';
import {
  LOAD_NEWS_REQUEST,
  LOAD_NEWS_FAIL,
  LOAD_NEWS_SUCCESS,
  LOAD_NEWS_PAGE_REQUEST,
  LOAD_NEWS_PAGE_FAIL,
  LOAD_NEWS_PAGE_SUCCESS
} from '../constants/News';
import {
  LOAD_OBJ_LENGTH_REQUEST,
  LOAD_OBJ_LENGTH_FAIL,
  LOAD_OBJ_LENGTH_SUCCESS,
} from '../constants/Common';
import {makeDataLoader} from '../utils'
import {ROOT_URL} from '../constants/Common';


export function loadNewsRequest() {
  return {
    type: LOAD_NEWS_REQUEST
  }
}

export function loadNewsFailure(error) {
  return {
    type: LOAD_NEWS_FAIL,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loadNewsSuccess(payload) {
  return {
    type: LOAD_NEWS_SUCCESS,
    payload: {
      data: payload.data,
      statusText: payload.statusText
    }
  }
}

export function loadNewsLengthRequest(objKey) {
  return {
    type: LOAD_OBJ_LENGTH_REQUEST,
    objKey
  }
}

export function loadNewsLengthFailure(objKey, error) {
  return {
    type: LOAD_OBJ_LENGTH_FAIL,
    objKey,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loadNewsLengthSuccess(objKey, payload) {
  return {
    type: LOAD_OBJ_LENGTH_SUCCESS,
    objKey,
    payload: {
      data: payload.data,
      statusText: payload.statusText
    }
  }
}

export function loadNews(perPage, nextPage, pageURL) {
  let start = perPage * (nextPage - 1);
  let limit = perPage;

  let config = {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({limit: limit, offset: start}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
     }
  }
  return function(dispatch) {
    dispatch(loadNewsRequest());
    return fetch(pageURL, config)
          .then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
             dispatch(loadNewsSuccess({
               data: response,
               statusText: 'Новости загружены'
             }))
          })
          .catch(error => {
             parseJSON(error.response).then(function(data) {
                  dispatch(loadNewsFailure({
                    response: {
                      status: error.response.status,
                      statusText: data.message}
                  }));
                  throw new Error(data.message);
             })
          })
  }
}

export function loadNewsLength(objKey) {
  let config = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
     }
  }
  return function(dispatch) {
    dispatch(loadNewsLengthRequest(objKey));
    return fetch(ROOT_URL + '/news/cnt', config)
          .then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
             dispatch(loadNewsLengthSuccess(objKey, {
               data: response,
               statusText: 'Кол-во новостей загружено'
             }))
          })
          .catch(error => {
             parseJSON(error.response).then(function(data) {
                  dispatch(loadNewsLengthFailure(objKey, {
                    response: {
                      status: error.response.status,
                      statusText: data.message}
                  }));
                  throw new Error(data.message);
             })
          })
  }
}

const loadNewsPage_ = makeDataLoader([
  LOAD_NEWS_PAGE_REQUEST,
  LOAD_NEWS_PAGE_SUCCESS,
  LOAD_NEWS_PAGE_FAIL
], ROOT_URL + '/news');

const shouldLoadNewsPage = (state, id) => {
  let item = state.newsPage && state.newsPage.data;
  return !(item && (item.id === id));
}

export const loadNewsPage = (id) => (dispatch, getState) => {
  let state = getState();
  if (id && shouldLoadNewsPage(state, id)) {
    let dataURL = ROOT_URL + '/news/' + id;
    return dispatch(loadNewsPage_(null, {dataURL: dataURL}));
  }
}
