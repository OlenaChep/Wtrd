import { checkHttpStatus, parseJSON } from '../utils';

export function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      callAPI,
      shouldCallAPI = () => true,
      payload = {}
    } = action

    if (!types) {
      // Normal action: pass it on
      return next(action)
    }
    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.')
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.')
    }
    console.log(getState());
    if (!shouldCallAPI(getState())) {
      return
    }

    const [ requestType, successType, failureType ] = types
    console('ppp=' + payload);
    dispatch(Object.assign({}, payload, {
      type: requestType
    }))

    return callAPI()
           .then(checkHttpStatus)
           .then(parseJSON)
           .then(response => {
             dispatch(Object.assign({}, payload, {
               response,
               type: successType
             }))
           })
           .catch(error => {
              parseJSON(error.response).then(function(data) {
                dispatch(Object.assign({}, payload, {
                  status: error.response.status,
                  statusText: data.message,
                  type: failureType
                }))
              })
           })
       }
 }
