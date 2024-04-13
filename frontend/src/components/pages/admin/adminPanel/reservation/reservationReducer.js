import { useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createReservationAdminPanel,
  getReservation,
  updateReservation as updateReservationAPI
} from "../../../../../services/reservation.service";
import { getAdminContent } from "../../../../../services/auth.service";

const initialState = {
  reservationData: {
    reservation: {
      price: "",
      message: "",
      from: "",
      to: ""
    },
    client: {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      patentNumber: "",
      postCode: "",
      street: "",
      streetNumber: "",
      city: ""
    }
  },
  status: {
    component: "initial",
    action: "initial",
    lastAction: null
  },
  errors: {
    reservation: {},
    client: {}
  }
};

const actions = {
  SET_RESERVATION_DATA: (state, { reservationData }) => {
    const { key, data } = reservationData;
    return {
      reservationData: {
        ...state.reservationData,
        [key]: {
          ...state.reservationData[key],
          ...data
        }
      }
    };
  },
  SET_STATUS: (state, { status }) => {
    const { key, result, lastAction } = status;
    return {
      status: {
        ...state.status,
        [key]: result,
        lastAction: lastAction ? lastAction : null
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

export const useReservationReducer = match => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { reservationData } = state;
  const { reservation, client } = reservationData;
  const { from, to, price, message } = reservation;

  const adminPanel = useQuery({
    queryKey: ["adminPanel"],
    queryFn: async () => await getAdminContent(),
    refetchOnWindowFocus: false
  });

  const reservationQuery = useQuery({
    queryKey: ["reservationQuery", match.params.id],
    queryFn: async () => await getReservation(match.params.id),
    refetchOnWindowFocus: false,
    enabled: !!match.params.id && adminPanel.isSuccess
  });

  const createReservation = useQuery({
    queryKey: ["createReservation"],
    queryFn: async () =>
      await createReservationAdminPanel({
        reservation: {
          yachtId: match.params.yachtId,
          startDate: from,
          endDate: to,
          price: parseFloat(price),
          message
        },
        client
      }),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  const updateReservation = useQuery({
    queryKey: ["updateReservation"],
    queryFn: async () =>
      await updateReservationAPI(match.params.id, {
        reservation: {
          startDate: from,
          endDate: to,
          price: parseFloat(price),
          message
        },
        client
      }),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  useEffect(() => {
    if (reservationQuery.isSuccess) {
      const reservation = {
        price: reservationQuery.data.reservation.price,
        message: reservationQuery.data.reservation.message,
        from: reservationQuery.data.reservation.startDate,
        to: reservationQuery.data.reservation.endDate
      };
      const client = reservationQuery.data.client;

      let reservationData = { key: "reservation", data: reservation };
      dispatch({ type: TYPES.SET_RESERVATION_DATA, reservationData });

      reservationData = { key: "client", data: client };
      dispatch({ type: TYPES.SET_RESERVATION_DATA, reservationData });
    }
  }, [reservationQuery.isSuccess]);

  return [
    state,
    {
      adminPanel,
      reservationQuery,
      createReservation,
      updateReservation,
      setReservationData: reservationData =>
        dispatch({ type: TYPES.SET_RESERVATION_DATA, reservationData }),
      setStatus: status =>
        dispatch({
          type: TYPES.SET_STATUS,
          status
        }),
      setErrors: errors =>
        dispatch({
          type: TYPES.SET_ERRORS,
          errors
        })
    }
  ];
};
