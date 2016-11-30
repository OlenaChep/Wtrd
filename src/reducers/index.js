 import { combineReducers} from 'redux'
 import userReducer from './user'
 import emailReducer from './email'
 import { reducer as formReducer } from 'redux-form'
 import {ordersState as orderReducer} from './order'
 import {orderSpecState as orderSpecReducer} from './order'
 import {gridState as gridReducer} from './grid'
 import {paginateState as paginateReducer} from './paginate'
 import dataLoader from './DataLoader'
 import {productCategoriesState as productCategoriesReducer} from './Product'
 import {productsState as productsReducer} from './Product'
 import {newsState as newsReducer} from './News'
 import {newsPageState as newsPageReducer} from './News'


 import {
   LOAD_OBJ_LENGTH_REQUEST,
   LOAD_OBJ_LENGTH_SUCCESS,
   LOAD_OBJ_LENGTH_FAIL
 } from '../constants/Common';

 /*import {
   LOAD_PRODUCT_CATEGORIES_REQUEST,
   LOAD_PRODUCT_CATEGORIES_FAIL,
   LOAD_PRODUCT_CATEGORIES_SUCCESS

 } from '../constants/Products';*/

 export const rootReducer = combineReducers({
   user: userReducer,
   email: emailReducer,
   form: formReducer,
   orders: orderReducer,
   orderSpec: orderSpecReducer,
   grids: gridReducer,
   paginate: paginateReducer,
   news: newsReducer,
   newsPage: newsPageReducer,
   objCount: dataLoader({
    types: [
      LOAD_OBJ_LENGTH_REQUEST,
      LOAD_OBJ_LENGTH_SUCCESS,
      LOAD_OBJ_LENGTH_FAIL
    ],
    mapActionToKey: action => action.objKey
  }),
  productCategories: productCategoriesReducer,
  products: productsReducer
 })
