import {
  LOAD_NEWS_REQUEST,
  LOAD_NEWS_FAIL,
  LOAD_NEWS_SUCCESS,

  LOAD_NEWS_PAGE_REQUEST,
  LOAD_NEWS_PAGE_FAIL,
  LOAD_NEWS_PAGE_SUCCESS,
} from '../constants/News'

import dataLoader from './DataLoader'

export const newsState = dataLoader({
  types: [
    LOAD_NEWS_REQUEST,
    LOAD_NEWS_SUCCESS,
    LOAD_NEWS_FAIL
  ],
  mapActionToKey: undefined
});

export const newsPageState = dataLoader({
  types: [
    LOAD_NEWS_PAGE_REQUEST,
    LOAD_NEWS_PAGE_SUCCESS,
    LOAD_NEWS_PAGE_FAIL
  ],
  mapActionToKey: undefined
})
