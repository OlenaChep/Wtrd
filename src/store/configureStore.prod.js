import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { rootReducer } from '../reducers'
import {redirect} from '../middlewares/redirect'
//import {callAPIMiddleware} from '../middlewares/callAPI'

export default function configureStore() {
  const store = compose(
    applyMiddleware(thunkMiddleware),
    applyMiddleware(redirect)
    //applyMiddleware(callAPIMiddleware)
  )(createStore)(rootReducer)

  return store
}
