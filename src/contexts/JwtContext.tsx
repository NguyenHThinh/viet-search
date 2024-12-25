"use client";

import PropTypes from "prop-types";
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
  FC,
  Reducer,
} from "react";
// config
import { APP_CONFIGS } from "@/config-global";
import localStorageAvailable from "@/utils/localStorageAvailable";
import {
  handleCallbackUrlMiddlewareServerComponent,
  setSession,
} from "@/auth/util";
import { getUserProfile } from "@/services/users";
import { userLogin, userLoginGoogle, userRegister } from "@/services/auth";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { COOKIE_NAMES } from "@/constants";
import { useRouter } from "next/navigation";
import { PATH_AUTH, PATH_PAGE } from "@/contains/paths";
// utils

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  phone?: string;
  about?: string;
  address?: string;
}

interface AuthState {
  isInitialized?: boolean;
  isAuthenticated?: boolean;
  user?: User | null;
}

interface AuthProviderProps {
  children?: ReactNode;
}

interface AuthAction {
  type: "INITIAL" | "LOGIN" | "REGISTER" | "LOGOUT";
  payload?: {
    isAuthenticated?: boolean;
    user?: object | null;
  };
}

interface AuthContextProps extends AuthState {
  method: string;
  refetchUserInfo: () => Promise<void>;
  login: (
    email: string,
    password: string,
    reCaptchaToken: string | null,
  ) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  userRegister: (
    email: string,
    password: string,
    name: string,
    lang: string,
    reCaptchaToken: string | null,
  ) => Promise<string>;
  logout: () => void;
}

const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIAL":
      return {
        isInitialized: true,
        isAuthenticated: action.payload?.isAuthenticated || false,
        user: action.payload?.user || null,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user || null,
      };
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user || null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextProps | null>(null);

// ----------------------------------------------------------------------

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<AuthState, AuthAction>>(
    reducer,
    initialState,
  );

  const router = useRouter();

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable
        ? localStorage.getItem(APP_CONFIGS.keyToken)
        : "";

      if (accessToken) {
        setSession(accessToken);

        const user = await getUserProfile();

        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (email: string, password: string, reCaptchaToken: string | null) => {
      const userLoginRes = await userLogin(email, password, reCaptchaToken);

      if (userLoginRes) {
        await setSession(userLoginRes?.accessToken, userLoginRes?.refreshToken);

        const userProfile = await getUserProfile();

        if (userProfile) {
          dispatch({
            type: "LOGIN",
            payload: {
              user: userProfile,
            },
          });
        }
      }
    },
    [],
  );

  const loginWithGoogle = useCallback(async (token: string = "") => {
    const userLoginRes = await userLoginGoogle(token);
    if (userLoginRes)
      await setSession(userLoginRes?.accessToken, userLoginRes?.refreshToken);
    const userProfile = await getUserProfile();
    if (userProfile) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: userProfile,
        },
      });
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      lang: string,
      reCaptchaToken: string | null,
    ) => {
      const response = await userRegister(
        email,
        password,
        name,
        lang,
        reCaptchaToken,
      );

      return response.email;
      // dispatch({
      //   type: 'REGISTER',
      //   payload: {
      //     user: response,
      //   },
      // });
    },
    [],
  );

  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: "LOGOUT",
    });
    router.replace(PATH_AUTH.login);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      refetchUserInfo: initialize,
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: "jwt",
      login,
      loginWithGoogle,
      userRegister: register,
      logout,
    }),
    [
      initialize,
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      loginWithGoogle,
      logout,
      register,
    ],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
