/*globals Promise:true*/
import {
  SET_PARAMS,
  GO_PAGE_REQUEST,
  GO_PAGE_SUCCESS,
  GO_PAGE_FAIL
} from '../constants/Paginate';

//const cPrev = -1;
//const cNext = 10000;

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
    let pageURL = (nextPage === 1)? objState.navURL: objState.navURL + '/page/' + nextPage;
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
/*
const cloneNavList = (navList) => {
  let newNavList = {};
  for(let key in navList) {
    let navLink = {...navList[key]};
    newNavList[key] = navLink;
  }
  return newNavList;
}

const nextPageInNavList = (nextPage, navList) => {
  for(let key in navList) {
    if (navList[key].caption == nextPage) {
      return true;
    }
  }
  return false;
}


const goNextPage = (objKey, state) => {
  return(dispatch) => {
    let currPage = state.paginate[objKey].currPage;
    let nextPage = currPage + 1;
    let pageCount = state.paginate[objKey].pageCount;
    if (nextPage <= pageCount) {
      dispatch(GoPage(objKey, {currPage: nextPage}));

      let navList = state.paginate[objKey].navList;
      let needUpdList = (!navList[cPrev].enabled) || (navList[cNext].enabled && (nextPage === pageCount));
      let isNextPageInNavList = nextPageInNavList(nextPage, navList);

      if (needUpdList || !isNextPageInNavList) {
        let navList = cloneNavList(state.paginate[objKey].navList);
        navList[cPrev].enabled = true;
        navList[cNext].enabled = (nextPage < pageCount);

        if (!isNextPageInNavList) {
          for(let key in navList) {
            if (typeof navList[key].caption === 'number') {
              navList[key].caption++;
            }
          }
        }
        dispatch(UpdNavList(objKey, {navList: navList}));
      }
    }
  }
}

const goPrevPage = (objKey, state) => {
  return(dispatch) => {
    let currPage = state.paginate[objKey].currPage;
    let nextPage = currPage - 1;
    if (nextPage >= 1) {
      dispatch(GoPage(objKey, {currPage: nextPage}));

      let navList = state.paginate[objKey].navList;
      let needUpdList = (!navList[cNext].enabled) || (navList[cPrev].enabled && (nextPage === 1));
      let isNextPageInNavList = nextPageInNavList(nextPage, navList);

      if (needUpdList || !isNextPageInNavList) {
        let navList = cloneNavList(state.paginate[objKey].navList);
        navList[cNext].enabled = true;
        navList[cPrev].enabled = (nextPage !== 1);

        if (!isNextPageInNavList) {
          for(let key in navList) {
            if (typeof navList[key].caption === 'number') {
              navList[key].caption--;
            }
          }
        }
        dispatch(UpdNavList(objKey, {navList: navList}));
      }
    }
  }
}

export const GoNextPage = (objKey) => (dispatch, getState) => {
   dispatch(goNextPage(objKey, getState()));
}

export const GoPrevPage = (objKey) => (dispatch, getState) => {
   dispatch(goPrevPage(objKey, getState()));
}

const goPage = (objKey, nextPage, state) => {
  return(dispatch) => {
    let currPage = state.paginate[objKey].currPage;
    let pageCount = state.paginate[objKey].pageCount;
    if ((nextPage <= 0)||(nextPage > pageCount)) {

    }

  }
}*/

/*
export function UpdNavList(objKey, payload) {
  return {
    type: UPD_NAV_LIST,
    objKey,
    payload: {
      navList: payload.navList
    }
  }
}

export function GoPage(objKey, payload) {
  return {
    type: GO_PAGE,
    objKey,
    payload: {
      currPage: payload.currPage
    }
  }
}*/
