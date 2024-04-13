import { useEffect, useReducer } from "react";
import {
  getAdminContent,
  register,
  updateUser as updateUserAPI
} from "../../../../../services/auth.service";
import { getUser } from "../../../../../services/auth.service";
import { useQuery } from "@tanstack/react-query";

const initialEdit = {
  userData: { username: "", email: "", roles: [] },
  errors: {
    userData: {}
  }
};
const initialNew = {
  userData: {
    username: "",
    password: "",
    email: "",
    roles: []
  },
  errors: {
    userData: {}
  }
};

const actions = {
  SET_USER_DATA: (state, { userData }) => {
    return {
      userData: {
        ...state.userData,
        ...userData
      }
    };
  },
  SET_ERRORS: (state, { errors }) => {
    const { data } = errors;
    return {
      errors: {
        ...data
      }
    };
  }
};

const TYPES = Object.keys(actions).reduce(
  (types, key) => ({
    ...types,
    [key]: key
  }),
  {}
);

const reducer = (state, action) => {
  if (action.type in actions) {
    const newState = actions[action.type](state, action);
    return { ...state, ...newState };
  }
  throw new Error(`unknown action ${Object.keys(action)}`);
};

export const useUserReducer = match => {
  const [state, dispatch] = useReducer(
    reducer,
    match.params.id ? initialEdit : initialNew
  );
  const { userData } = state;
  const { username, email, roles } = userData;

  const adminPanel = useQuery({
    queryKey: ["adminPanel"],
    queryFn: async () => await getAdminContent(),
    refetchOnWindowFocus: false
  });

  const userQuery = useQuery({
    queryKey: ["userQuery", match.params.id],
    queryFn: async () => await getUser(match.params.id),
    refetchOnWindowFocus: false,
    enabled: !!match.params.id && adminPanel.isSuccess
  });

  const createUser = useQuery({
    queryKey: ["createUser"],
    queryFn: async () => await register(userData),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  const updateUser = useQuery({
    queryKey: ["updateUser", match.params.id],
    queryFn: async () =>
      await updateUserAPI(match.params.id, {
        username,
        email,
        roles
      }),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  useEffect(() => {
    if (userQuery.isSuccess)
      dispatch({
        type: TYPES.SET_USER_DATA,
        userData: userQuery.data
      });
  }, [userQuery.isSuccess]);

  return [
    state,
    {
      adminPanel,
      userQuery,
      createUser,
      updateUser,
      setUserData: userData =>
        dispatch({ type: TYPES.SET_USER_DATA, userData }),
      setErrors: errors =>
        dispatch({
          type: TYPES.SET_ERRORS,
          errors
        })
    }
  ];
};
