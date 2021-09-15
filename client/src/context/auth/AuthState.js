import React, { useReducer } from "react";
import AuthContext from "./authContext";
import AuthReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import axios from 'axios';

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

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem("token"),
        isAuthenticated: null,
        loading: true,
        error: null,
        user: null
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // Load User
    const loadUser = async () => {

        if(localStorage.getItem("token")) {
            setAuthToken(localStorage.getItem("token"));
        }

        try {
            const res = await axios.get('/api/auth');
            dispatch({ type: USER_LOADED, payload: res.data });
        } catch (err) {
            dispatch({ type: AUTH_ERROR });
        }

    }

    // Register User
    const registerUser = async formData => {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.post("/api/users", formData, config);
            dispatch({ 
                type: REGISTER_SUCCESS, 
                payload: res.data 
            });
            
            loadUser();
        } catch (err) {
            dispatch({ 
                type: REGISTER_FAIL, 
                payload: err.response.data.msg 
            });
        }
    }

    // Login
    const login = async formData => {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const res = await axios.post("/api/auth", formData, config);
            dispatch({ 
                type: LOGIN_SUCCESS, 
                payload: res.data 
            });
            
            loadUser();
        } catch (err) {
            dispatch({ 
                type: LOGIN_FAIL, 
                payload: err.response.data.msg 
            });
        }
    }

    // Logout
    const logout = () => dispatch({ type: LOGOUT });

    // Clear errors
    const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                user: state.user,
                loading: state.loading,
                isAuthenticated: state.isAuthenticated,
                error: state.error,
                registerUser,
                clearErrors,
                loadUser,
                login,
                logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthState;