//import jwtDecode from 'jwt-decode';

import {
  SET_CURR_ROW_KEY
} from '../constants/Grid'

const initialState = {
  currentRowKey: null
}

function grids(state=initialState, action) {

  switch (action.type) {
//LOGIN
    case SET_CURR_ROW_KEY:{
      return {...state,
              currentRowKey: action.payload.currentRowKey};
    }
    default:
      return state
  }
}

export function gridState(state = {}, action) {  
  switch (action.type) {
    case SET_CURR_ROW_KEY:
      return Object.assign({}, state, {
        [action.gridName]: grids(state[action.gridName], action)
      })
    default:
      return state
  }
}
