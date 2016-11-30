export const ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:3000/api' : '/api';
export const STATIC_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:3000/static': '/static';

export const LOAD_OBJ_LENGTH_REQUEST = 'LOAD_OBJ_LENGTH_REQUEST';
export const LOAD_OBJ_LENGTH_SUCCESS = 'LOAD_OBJ_LENGTH_SUCCESS';
export const LOAD_OBJ_LENGTH_FAIL = 'LOAD_OBJ_LENGTH_FAIL';
