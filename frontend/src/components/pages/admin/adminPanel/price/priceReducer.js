import { useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createPrice as createPriceAPI,
  updatePrice as updatePriceAPI
} from "../../../../../services/price.service";
import { getPrice } from "../../../../../services/price.service";
import { getAdminContent } from "../../../../../services/auth.service";

const initialState = {
  priceData: {
    date: "",
    price: ""
  },
  errors: {
    priceData: {}
  }
};

const actions = {
  SET_PRICE_DATA: (state, { priceData }) => {
    return {
      priceData: {
        ...state.priceData,
        ...priceData
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

export const usePriceReducer = match => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { priceData } = state;
  const { price, date } = priceData;

  const adminPanel = useQuery({
    queryKey: ["adminPanel"],
    queryFn: async () => await getAdminContent(),
    refetchOnWindowFocus: false
  });

  const priceQuery = useQuery({
    queryKey: ["priceQuery", match.params.id],
    queryFn: async () => await getPrice(match.params.id),
    refetchOnWindowFocus: false,
    enabled: !!match.params.id && adminPanel.isSuccess
  });

  const createPrice = useQuery({
    queryKey: ["createPrice"],
    queryFn: async () =>
      await createPriceAPI({
        price: parseFloat(price),
        date: date,
        yachtId: match.params.yachtId
      }),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  const updatePrice = useQuery({
    queryKey: ["updatePrice"],
    queryFn: async () =>
      await updatePriceAPI(match.params.id, {
        price: parseFloat(price),
        date: date
      }),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  useEffect(() => {
    if (priceQuery.isSuccess)
      dispatch({ type: TYPES.SET_PRICE_DATA, priceData: priceQuery.data });
  }, [priceQuery.isSuccess]);

  return [
    state,
    {
      adminPanel,
      createPrice,
      updatePrice,
      priceQuery,
      setPriceData: priceData =>
        dispatch({ type: TYPES.SET_PRICE_DATA, priceData }),
      setErrors: errors =>
        dispatch({
          type: TYPES.SET_ERRORS,
          errors
        })
    }
  ];
};
