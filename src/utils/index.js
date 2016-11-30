import fetch from 'isomorphic-fetch';

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText || response.message)
        error.response = response
        throw error
        /*
        parseJSON(response).then(function(data) {
          console.log(data);
          console.log(response)
          var error = new Error(data.message || response.statusText)
          error.response = response
          throw error;
        });*/
    }
}

export function parseJSON(response) {
     return response.json()
}

export function makeActionCreator(type) {
  return function(objKey, payload) {
    let action;
    if (objKey) {
      action = {type: type, objKey};
    } else {
      action = {type: type};
    }
    if (payload) {
      action.payload = {};
      for(let key in payload) {
        let item = {...payload[key]};
        action.payload[key] = item;
      }
    }

    return action;
  }
}

export function makeDataLoader(types, dataURL) {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.')
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected types to be strings.')
  }

  const [ requestType, successType, failureType ] = types;

  return function(objKey, params) {
    let configDefault = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return function(dispatch) {
      dispatch(Object.assign({},
          { type: requestType,
            objKey}));
      return fetch((params && params.dataURL) || dataURL, (params && params.config) || configDefault)
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(Object.assign({},
                  { type: successType,
                    objKey,
                    payload: {
                               data: response,
                               statusText: 'Данные загружены'
                             }
                  }));
            })
            .catch(error => {
               parseJSON(error.response).then(function(data) {
                    dispatch(Object.assign({},
                       { type: failureType,
                         objKey,
                         payload: {
                           error: {
                             response: {
                               status: error.response.status,
                               statusText: data.message
                             }
                           },
                           status: error.response.status,
                           statusText: data.message
                         }
                       }));
                    throw new Error(data.message);
               })
            })
    }
   }
}
