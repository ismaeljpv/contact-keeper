import {
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    CLEAR_ERRORS,
    LOGOUT,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED
} from '../types';

const AuthReducer = (state, action) => {
    switch (action.type) {
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading:false,
          user: action.payload
        };
      case LOGIN_SUCCESS:  
      case REGISTER_SUCCESS:
        localStorage.setItem("token", action.payload.token);
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true,
          loading: false
        }
      case LOGIN_FAIL:  
      case REGISTER_FAIL:
      case AUTH_ERROR:
      case LOGOUT:    
        localStorage.removeItem("token");
        return {
          ...state,
          token: null,
          isAuthenticated: null,
          loading: false,
          error: action.payload
        }
      case CLEAR_ERRORS:
        return {
          ...state,
          error : null
        }  
      default:
        return state;
    }
  };
  
  export default AuthReducer;