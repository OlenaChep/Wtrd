import {
  LOAD_PRODUCT_CATEGORIES_REQUEST,
  LOAD_PRODUCT_CATEGORIES_FAIL,
  LOAD_PRODUCT_CATEGORIES_SUCCESS,
  SELECT_CATEGORY,
  SET_OPENED,
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCTS_FAIL
} from '../constants/Products'

import dataLoader from './DataLoader'

const initialState = {
  doClose: null,
  selected: null,
  opened: null,
  children: null
}


function selector(state = initialState, action) {
  switch (action.type) {
    case SELECT_CATEGORY:
      return {...state,
              doClose: action.payload.doClose,
              selected: action.payload.id,
              children: action.payload.children
            };
    case SET_OPENED:
      return {...state,
              opened: action.payload.opened};
    default:
      return state
  }
}



const dataLoader_ = dataLoader({
  types: [
    LOAD_PRODUCT_CATEGORIES_REQUEST,
    LOAD_PRODUCT_CATEGORIES_SUCCESS,
    LOAD_PRODUCT_CATEGORIES_FAIL
  ],
  mapActionToKey: undefined
});

export function productCategoriesState(state = {}, action) {
  return {
    selector: selector(state.selector, action),
    main: dataLoader_(state.main, action)
  }
}

export const productsState = dataLoader({
  types: [
    LOAD_PRODUCTS_REQUEST,
    LOAD_PRODUCTS_SUCCESS,
    LOAD_PRODUCTS_FAIL
  ],
  mapActionToKey: undefined
});
