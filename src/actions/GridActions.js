import {
  SET_CURR_ROW_KEY
} from '../constants/Grid';

function SetCurrRowKey(gridName, key) {
  return {
    type: SET_CURR_ROW_KEY,
    gridName,
    payload: {
      currentRowKey: key
    }
  }
}

export function gridSetCurrRowKey(gridName, key) {
  return function(dispatch) {
    dispatch(SetCurrRowKey(gridName, key));
  }
}
