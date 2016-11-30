const initialState = {
    data: null,
    loading: false,
    error: null,
    statusText: null
};
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
const dataLoader = ({ types, mapActionToKey }) => {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.')
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected types to be strings.')
  }
  if (mapActionToKey && typeof mapActionToKey !== 'function') {
    throw new Error('Expected mapActionToKey to be a function.')
  }

  const [ requestType, successType, failureType ] = types

  const loader = (state = initialState, action) => {
    switch (action.type) {
      case requestType:
        return {...state,
                loading: true,
                error: null,
                statusText: null};
      case successType:
        return {...state,
                loading: false,
                error: null,
                statusText: action.payload.statusText,
                data: action.payload.data};
      case failureType:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          statusText: `Ошибка загрузки: ${action.payload.status} ${action.payload.statusText}.`};
      default:
        return state
    }
  }

  return (state = {}, action) => {

    switch (action.type) {
      case requestType:
      case successType:
      case failureType:
        if(mapActionToKey) {
          const key = mapActionToKey(action)
          if (typeof key !== 'string') {
            throw new Error('Expected key to be a string.')
          }
          return { ...state,
            [key]: loader(state[key], action)
          }
        } else {
          return loader(state, action)
        }
      default:
        return state
    }
  }
}

export default dataLoader
