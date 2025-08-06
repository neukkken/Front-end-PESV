import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AuthService from "../core/services/auth.js";
import Cookies from "js-cookie";
import decodeToken from '../utils/decodeToken.js';

const USER_PESV = import.meta.env.VITE_ROLE_USER_PESV;

// Crear el contexto
const AuthContext = createContext();


// Hook para acceder al contexto
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// Proveedor de autenticación
const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginErrors, setLoginErrors] = useState([]);

  //Para reestablecer los errores en 2,5 s
  useEffect(() => {

    if (loginErrors.length > 0) {
      const timer = setTimeout(() => {
        setLoginErrors([])
      }, 2500)

      return () => clearTimeout(timer)
    }

  }, [loginErrors])

  const signIn = async (user) => {
    try {
      const response = await AuthService.loginUser(user);
      const { data } = response;
      console.log(data.token)

  
      if (data.user.roleId === USER_PESV) {
        setLoginErrors(["Este rol no puede acceder al sistema"])
        return null
      }

      setIsAuthenticated(true);
      setUser(data.user);
      sessionStorage.setItem('accessToken', data.token);
      return response

    } catch (error) {
      console.log(error.response);
      setLoginErrors([error.response.data.message])
      return error.response
    }

  }

  const logOut = () => {
    sessionStorage.clear();

    try {

    } catch (error) {
      console.log(error.response);

    }

  }



  useEffect(() => {
    async function checkLogin() {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await AuthService.verfyAuth();
        const res = response;
        if (res.status === 200) {
          const { data } = response;
          setIsAuthenticated(true);
          console.log(data.data)
          setUser(data.data)

        }
        else {
          setUser(null);
          setIsAuthenticated(false);

        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);


  return (
    <AuthContext.Provider value={{ signIn, logOut, loginErrors, loading, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthProvider, useAuth };



