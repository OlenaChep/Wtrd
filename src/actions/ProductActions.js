import {
  LOAD_PRODUCT_CATEGORIES_REQUEST,
  LOAD_PRODUCT_CATEGORIES_FAIL,
  LOAD_PRODUCT_CATEGORIES_SUCCESS,
  SELECT_PRODUCT_CATEGORY,
  SELECT_CATEGORY,
  SET_OPENED,
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCTS_FAIL
} from '../constants/Products';
import {
  LOAD_OBJ_LENGTH_REQUEST,
  LOAD_OBJ_LENGTH_FAIL,
  LOAD_OBJ_LENGTH_SUCCESS,
} from '../constants/Common';
import {ROOT_URL} from '../constants/Common';

import * as PaginateActions from './PaginateActions'
import { bindActionCreators } from 'redux'
import {makeActionCreator,  makeDataLoader} from '../utils'


export const loadProductCategoriesRequest = makeActionCreator('LOAD_PRODUCT_CATEGORIES_REQUEST')
export const loadProductCategoriesFail = makeActionCreator('LOAD_PRODUCT_CATEGORIES_FAIL')
export const loadProductCategoriesSuccess = makeActionCreator('LOAD_PRODUCT_CATEGORIES_SUCCESS')

export const loadProductCategories = makeDataLoader([
  LOAD_PRODUCT_CATEGORIES_REQUEST,
  LOAD_PRODUCT_CATEGORIES_SUCCESS,
  LOAD_PRODUCT_CATEGORIES_FAIL
], ROOT_URL + '/ggroups');

const shouldLoadData = (state, nodeName, objKey) => {
  let items;
  if (!objKey) {
    items = state[nodeName] && state[nodeName].data;
  } else {
    items = state[nodeName] && (state[nodeName])[objKey] && (state[nodeName])[objKey].data;
  }
  if (!items) {
    return true;
  }
  return false;
}

export const loadProductCategoriesIfNeed = () => (dispatch, getState) => {
  if (shouldLoadData(getState(), 'productCategories')) {
    return dispatch(loadProductCategories())
                   .catch(() => {});
  }
}

export const selectProductCategory = (id, children) => (dispatch, getState) => {
  let state = getState();
  let plainData = state.productCategories && state.productCategories.main && state.productCategories.main.data
    && state.productCategories.main.data.plain;

  let children_;
  if (children && plainData) {
      children_ = children.map((item) => {
        let data = plainData[item.id];
        return Object.assign({}, {id: data.id, caption: data.name, imgURL: undefined});
      })
    }

  dispatch(Object.assign({},
        { type: SELECT_PRODUCT_CATEGORY,
          payload: {
            id: id,
            children: children_
          }
        }));
}

const getToOpen = (nodeId, plainData) => {
    if (!nodeId) {
      return undefined;
    }
    if (!plainData[nodeId]) {
      return undefined;
    }

    let result = {};
    if (plainData[nodeId].togglable) {
       result[nodeId] = true;
    }
    let build = function(id) {
      let parentId = plainData[id] && plainData[id].parentId;
      if (parentId) {
        result[parentId]=true;
        build(parentId);
      }
    };
    build(nodeId);
    return result;
  }

const findChilds = (nodeId, treeData) => {
  if (! (nodeId && treeData)) {
    return undefined;
  }
  let childs;
  let findChilds_ = function(items, nodeId) {
     let i = 0;
     let result;
     while (!result && (i < items.length)) {
       if (items[i].id === nodeId) {
          childs = items[i].children;
          result = true;
       } else if (items[i].children) {
          findChilds_(items[i].children, nodeId);
       }
       i++;
     }
  }

  findChilds_(treeData, nodeId);
  return childs;
}


const getToClose = (nodeId, childs) => {
  if (!nodeId) {
    return undefined;
  }
  if (!childs) {
    return undefined;
  }

  let result = {};
  result[nodeId] = true;
  let build = function(items) {
    items.forEach((item) => {
      if (item.children) {
        result[item.id] = true;
        build(item.children);
      }
    })
  }
  build(childs);
  return result;
}

const getChildsData = (children, plainData) => {
  let result;
  if (children && plainData) {
      result = children.map((item) => {
        let data = plainData[item.id];
        return Object.assign({}, {id: data.id, caption: data.name, imgURL: undefined});
      })
    }
  return result;
}

export const selectCategory = (id, doClose, nextPage) => (dispatch, getState) => {
  let state = getState();
  let plainData = state.productCategories && state.productCategories.main && state.productCategories.main.data
   && state.productCategories.main.data.plain;
  let treeData = state.productCategories && state.productCategories.main && state.productCategories.main.data
   && state.productCategories.main.data.tree;

  if (!id) {
    if (treeData && plainData) {
      let childs = treeData.map((item) => {
        return Object.assign({}, {id: item.id});
      });
      dispatch(Object.assign({},
                 { type: SELECT_CATEGORY,
                   payload: {
                      id: null,
                      nodeState: null,
                      children: getChildsData(childs, plainData)
                    }
                  }));
    }
  }
  else if (plainData[id]) {
    let prevId = (state.productCategories && state.productCategories.selector &&  state.productCategories.selector.selected) || 0;
    let prevDoClose = (state.productCategories && state.productCategories.selector &&  state.productCategories.selector.doClose) || false;
    if (((id || 0) === prevId) && (prevDoClose === (doClose || false))) {
      return;
    }
    let opened_ = state.productCategories && state.productCategories.selector && state.productCategories.selector.opened;
    let nodes;
    let childs = findChilds(id, treeData);
    if (doClose) {
      nodes = getToClose(id, childs);
      if (nodes) {
        let opened = {};
        for(let key in opened_) {
          if (!nodes[key]) {
            opened[key] = true;
          }
        }
        dispatch(Object.assign({},
                  { type: SET_OPENED,
                     payload: {
                       opened: opened
                     }
                  }));
      }
      dispatch(Object.assign({},
                 { type: SELECT_CATEGORY,
                   payload: {
                      id: id,
                      doClose: doClose,
                      children: getChildsData(childs, plainData)
                    }
                  }));
    } else {
      nodes = getToOpen(id, plainData);
      if (nodes) {
        dispatch(Object.assign({},
                  { type: SET_OPENED,
                     payload: {
                       opened: Object.assign({}, opened_, nodes)
                     }
                  }));
      }
      dispatch(Object.assign({},
               { type: SELECT_CATEGORY,
                 payload: {
                    id: id,
                    doClose: doClose,
                    children: getChildsData(childs, plainData)
                  }
                }));
      if (!childs) {
        console.log(nextPage);
        dispatch(loadCategoryProducts(id, (nextPage || 1), true));
      }
    }
  }
}

const loadProducts_ = makeDataLoader([
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCTS_FAIL
], ROOT_URL + '/ggroups');

const loadProductsCount_ = makeDataLoader([
  LOAD_OBJ_LENGTH_REQUEST,
  LOAD_OBJ_LENGTH_SUCCESS,
  LOAD_OBJ_LENGTH_FAIL
], ROOT_URL + '/ggroups');


const loadCategoryProducts = (id, nextPage, doPreparePaginate) => (dispatch, getState) => {
  if (doPreparePaginate) {
    let loadProducts_ = bindActionCreators(loadProducts, dispatch);
    let getProductsCnt = bindActionCreators(getProductsCount, dispatch);
    getProductsCnt(id).then(() => {
       let state = getState();
       let objCount = state.objCount['goods'].data || 1;
       dispatch(PaginateActions.PreparePagination(
          'goods', 12, objCount, 7, ROOT_URL + '/ggroups/' + id + '/goodsAll', loadProducts_));
       dispatch(PaginateActions.GoPage('goods', nextPage));
    });
  }
}

export function loadProducts(perPage, nextPage, pageURL) {
  let start = perPage * (nextPage - 1);
  let limit = perPage;

  let config = {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({limit: limit, offset: start}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
     }
  }
  return loadProducts_(null, {config: config, dataURL: pageURL});
}

export function getProductsCount(category) {
  let dataURL = ROOT_URL + '/ggroups/' + category + '/cnt';
  return loadProductsCount_('goods', {dataURL: dataURL});
}
