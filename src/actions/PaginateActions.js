/*globals Promise:true*/
import {
  SET_PARAMS,
  GO_PAGE_REQUEST,
  GO_PAGE_SUCCESS,
  GO_PAGE_FAIL
} from '../constants/Paginate';

function SetParams(objKey, payload) {
  return {
    type: SET_PARAMS,
    objKey,
    payload: {
      perPage: payload.perPage,
      objCount: payload.objCount,
      navMaxCnt: payload.navMaxCnt,
      pageCount: payload.pageCount,
      navURL: payload.navURL,
      fetchFunc: payload.fetchFunc
    }
  }
}

export function GoPageRequest(objKey, payload) {
  return {
    type: GO_PAGE_REQUEST,
    objKey,
    payload: {
      nextPage: payload.nextPage
    }
  }
}

export function GoPageFail(objKey, error) {
  return {
    type: GO_PAGE_FAIL,
    objKey,
    payload: {
      error: error,
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function GoPageSuccess(objKey, payload) {
  return {
    type: GO_PAGE_SUCCESS,
    objKey,
    payload: {
      statusText: payload.statusText,
      currPage: payload.currPage,
      firstPage: payload.firstPage
      //items: payload.items
    }
  }
}

export function PreparePagination(objKey, perPage, objCount, navCount = 5, navURL, fetchFunc) {
  return (dispatch) => {
    if (!perPage || (perPage < 0)) {
      throw new Error('Недопусимое значение параметра объектов на странице perPage');
    }
    if ((!objCount && (objCount !==0)) || (objCount < 0)) {
      throw new Error('Недопустимое значение общего кол-ва объектов itemsCount');
    }
    if ((navCount < 5) || (navCount > 50)) {
      throw new Error('Недопустимое значение кол-ва кнопок навигации navCount');
    }
    if (!navURL) {
      throw new Error('Не задан navURL');
    }
    if (!fetchFunc) {
      throw new Error('Не задан метод загрузки данных fetchFunc');
    }
    let pageCount = 0;
    if (objCount !== 0) {
      pageCount = Math.ceil(objCount / perPage);
    }
    if (navCount > pageCount) {
      navCount = pageCount;
    }
    dispatch(SetParams(objKey, {perPage: perPage, objCount: objCount,
      navMaxCnt: navCount, navURL: navURL, pageCount: pageCount,
      fetchFunc: fetchFunc
    }));
  }
}


const goPage = (objKey, nextPage, state) => {
  return (dispatch) => {
    let objState = state.paginate[objKey];
    let pageCount = objState.pageCount;
    if ((nextPage < 1) || (nextPage > pageCount)) {
      dispatch(GoPageFail(objKey,
                         {
                           response: {
                             status: 403,
                             statusText: 'Недопустимое значение сл. страницы'}
                          }));
      return new Promise(() => {
                           throw new Error('Недопустимое значение сл. страницы');
                         });
    }
    dispatch(GoPageRequest(objKey, {nextPage: nextPage}));
    let pageURL = (nextPage === 1)? objState.navURL : objState.navURL + '?page=' + nextPage;
    //alert(pageURL);
    return objState.fetchFunc(objState.perPage, nextPage, pageURL)
                   .then(() => {
                     let firstPage = objState.firstPage || 1;
                     let navMaxCnt = objState.navMaxCnt;
                     if (nextPage < firstPage) {
                       firstPage = nextPage;
                     } else if (nextPage >= firstPage + navMaxCnt) {
                       firstPage = nextPage - navMaxCnt + 1;
                     }
                     dispatch(GoPageSuccess(objKey, {statusText: 'Переход успешен', currPage: nextPage, firstPage: firstPage}));
                   })
                  .catch((error) => {
                    dispatch(GoPageFail(objKey, {
                      response: {
                      status: 403,
                      statusText: error.message}
                    }));
                  })
  }
}

export const GoPage = (objKey, nextPage) => (dispatch, getState) => {
   dispatch(goPage(objKey, nextPage, getState()));
}

export const InitializePages = (objKey, objCountFunc, perPage, navCount = 5, navURL,
    fetchFunc, currPage) => (dispatch, getState) => {

  objCountFunc(objKey).then(() => {
    let state = getState();
    let objCount = state.objCount[objKey].data;
    dispatch(PreparePagination(objKey, perPage, objCount, navCount, navURL, fetchFunc));
    dispatch(GoPage(objKey, currPage));
  })
  
}
