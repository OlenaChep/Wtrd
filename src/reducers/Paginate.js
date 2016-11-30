import {
  SET_PARAMS,
//  UPD_NAV_LIST,
  //GO_PAGE,
  GO_PAGE_REQUEST,
  GO_PAGE_SUCCESS,
  GO_PAGE_FAIL
  //GO_PAGE_NO,
  //GO_PAGE_PREV,
  //GO_PAGE_NEXT,
  //INVALIDATE_PAGE
} from '../constants/Paginate'

const initialState = {
    loading: false,
    error: null,
    statusText: null,
    perPage: null,
    objCount: null,
    pageCount: null,
    navMaxCnt: null,
    navURL: null,
    fetchFunc: null,
    nextPage: null,
    firstPage: null
    //currPage: null,
    //navList: null
};

function paginate(state=initialState, action) {
  switch (action.type) {

    case SET_PARAMS:
      return {...state,
              loading: false,
              error: null,
              statusText: null,
              perPage: action.payload.perPage,
              objCount: action.payload.objCount,
              pageCount: action.payload.pageCount,
              navMaxCnt: action.payload.navMaxCnt,
              navURL: action.payload.navURL,
              fetchFunc: action.payload.fetchFunc,
              nextPage: null,
              firstPage: null,
              currPage: null              
            }
              //items: null};
              //pageCount: action.payload.pageCount,
              //currPage: action.payload.currPage,
              //navList: null};
    /*case UPD_NAV_LIST:
      return {...state,
              navList: action.payload.navList};
    case GO_PAGE:
      return {...state,
              currPage: action.payload.currPage};*/

    case GO_PAGE_REQUEST:
      return {...state,
              loading: true,
              nextPage: action.payload.nextPage,
              error: null,
              statusText: null};
    case GO_PAGE_FAIL:
      return {...state,
             loading: false,
             error: action.payload.error,
             statusText: `Ошибка перехода на новую страницу: ${action.payload.status} ${action.payload.statusText}.`};
    case GO_PAGE_SUCCESS:
      return {...state,
              loading: false,
              error: null,
              statusText: action.payload.statusText,
              firstPage: action.payload.firstPage,
              currPage: action.payload.currPage
            };
              //items: action.payload.items
     default:
       return state
  }
}


export function paginateState(state = {}, action) {
  switch (action.type) {
    case SET_PARAMS:
    case GO_PAGE_REQUEST:
    case GO_PAGE_SUCCESS:
    case GO_PAGE_FAIL:
      return Object.assign({}, state, {
        [action.objKey]: paginate(state[action.objKey], action)
      })
    default:
      return state
  }
}
