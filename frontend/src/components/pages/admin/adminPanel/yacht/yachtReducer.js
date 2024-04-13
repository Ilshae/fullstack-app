import { useEffect, useReducer } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  createYacht as createYachtAPI,
  getYacht,
  updateYacht as updateYachtAPI
} from "../../../../../services/yacht.service";
import {
  deleteByFileId,
  getFilesByYachtId,
  uploadFilesToBackend
} from "../../../../../services/file.service";
import { getAdminContent } from "../../../../../services/auth.service";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const initialState = {
  yachtData: {
    yacht: {
      model: "",
      modelNumber: "",
      name: "",
      people: "",
      year: ""
    },
    technicalData: {
      length: "",
      width: "",
      height: "",
      engineType: "",
      engineManufacturer: "",
      enginePower: "",
      depth: "",
      mass: "",
      bottomBalast: "",
      sailsSurface: "",
      keelType: "",
      keelWeight: "",
      stereType: ""
    },
    equipment: {
      bowBasket: false,
      cookingEquipment: false,
      drinkingWaterInstallation: false,
      echosounder: false,
      emergencyMeasures: false,
      fridge: false,
      heating: false,
      hotWater: false,
      installation220v: false,
      lakeWaterInstallation: false,
      mp3: false,
      radio: false,
      railings: false,
      rectifier: false,
      socket12v: false,
      sprayhood: false,
      tableware: false,
      tent: false,
      tv: false,
      other: ""
    },
    gallery: [],
    galleryToBeAdded: [],
    galleryToBeRemoved: []
  },
  errors: {
    yacht: {},
    technicalData: {},
    equipment: {},
    galleryToBeAdded: ""
  }
};

const actions = {
  SET_INITIAL_DATA: (state, { yachtData }) => {
    console.log("SET_INITIAL_DATA");
    return {
      yachtData: {
        ...yachtData,
        gallery: [],
        galleryToBeAdded: [],
        galleryToBeRemoved: []
      }
    };
  },
  SET_YACHT_DATA: (state, { yachtData }) => {
    const { key, data } = yachtData;
    return {
      yachtData: {
        ...state.yachtData,
        [key]: {
          ...state.yachtData[key],
          ...data
        }
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
  },
  ADD_TO_GALLERY_TO_BE_ADDED: (state, { files }) => {
    return {
      yachtData: {
        ...state.yachtData,
        galleryToBeAdded: [...state.yachtData.galleryToBeAdded, ...files]
      }
    };
  },
  REMOVE_FROM_GALLERY_TO_BE_ADDED: (state, { key }) => {
    return {
      yachtData: {
        ...state.yachtData,
        galleryToBeAdded: state.yachtData.galleryToBeAdded.filter(
          (item, index) => index !== key
        )
      }
    };
  },
  ADD_TO_GALLERY_TO_BE_REMOVED: (state, { id }) => {
    return {
      yachtData: {
        ...state.yachtData,
        galleryToBeRemoved: [...state.yachtData.galleryToBeRemoved, id]
      }
    };
  },
  REMOVE_FROM_GALLERY_TO_BE_REMOVED: (state, { id }) => {
    return {
      yachtData: {
        ...state.yachtData,
        galleryToBeRemoved: state.yachtData.galleryToBeRemoved.filter(
          item => parseInt(item) !== id
        )
      }
    };
  },
  CLEAR_TEMP_GALLERIES: state => {
    return {
      yachtData: {
        ...state.yachtData,
        galleryToBeAdded: [],
        galleryToBeRemoved: []
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

export const useYachtReducer = match => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { yachtData } = state;
  const {
    yacht,
    technicalData,
    equipment,
    galleryToBeAdded,
    galleryToBeRemoved
  } = yachtData;

  const adminPanel = useQuery({
    queryKey: ["adminPanel"],
    queryFn: async () => await getAdminContent(),
    refetchOnWindowFocus: false
  });

  const yachtDataQuery = useQuery({
    queryKey: ["yachtDataQuery", match.params.id],
    queryFn: async () => await getYacht(match.params.id),
    refetchOnWindowFocus: false,
    enabled: !!match.params.id && adminPanel.isSuccess,
    cacheTime: 0
  });

  const galleryQuery = useQuery({
    queryKey: ["galleryQuery", match.params.id],
    queryFn: async () => await getFilesByYachtId(match.params.id),
    refetchOnWindowFocus: false,
    enabled: !!match.params.id && adminPanel.isSuccess,
    cacheTime: 0
  });

  const createYacht = useQuery({
    queryKey: ["createYacht"],
    queryFn: async () =>
      await createYachtAPI({
        yacht,
        technicalData,
        equipment
      }),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  const updateYacht = useQuery({
    queryKey: ["updateYacht", match.params.id],
    queryFn: async () =>
      await updateYachtAPI(match.params.id, {
        yacht,
        technicalData,
        equipment
      }),
    refetchOnWindowFocus: false,
    enabled: false,
    cacheTime: 0
  });

  /* eslint-disable-next-line */
  const uploadFiles = useQueries({
    queries: Object.values(galleryToBeAdded).map(file => {
      return {
        queryKey: [
          "uploadFile",
          file.name,
          createYacht?.data,
          match?.params?.id
        ],
        queryFn: () =>
          uploadFilesToBackend(
            file,
            match?.params?.id ? match.params.id : createYacht.data
          ),
        refetchOnWindowFocus: false,
        enabled: createYacht.isSuccess || updateYacht.isSuccess,
        cacheTime: 0
      };
    })
  });

  /* eslint-disable-next-line */
  const removeFiles = useQueries({
    queries: galleryToBeRemoved.map(id => {
      return {
        queryKey: ["removeFiles", id],
        queryFn: () => deleteByFileId(id),
        refetchOnWindowFocus: false,
        enabled: false,
        cacheTime: 0
      };
    })
  });

  useEffect(() => {
    if (yachtDataQuery.isSuccess)
      dispatch({
        type: TYPES.SET_INITIAL_DATA,
        yachtData: yachtDataQuery.data
      });

    if (galleryQuery.isSuccess)
      dispatch({
        type: TYPES.SET_YACHT_DATA,
        yachtData: { key: "gallery", data: galleryQuery.data }
      });
  }, [yachtDataQuery.isSuccess, galleryQuery.isSuccess]);

  return [
    state,
    {
      adminPanel,
      yachtDataQuery,
      galleryQuery,
      createYacht,
      updateYacht,
      setYachtData: yachtData =>
        dispatch({ type: TYPES.SET_YACHT_DATA, yachtData }),
      setErrors: errors =>
        dispatch({
          type: TYPES.SET_ERRORS,
          errors
        }),
      handleCreateYacht: async () => {
        await createYacht.refetch().then(async res => {
          await sleep(2500);
          const filesUploaded = uploadFiles.every(async q => await q.isSuccess);
          if (res.isSuccess && filesUploaded) {
            await dispatch({
              type: TYPES.SET_INITIAL_DATA,
              yachtData: initialState.yachtData
            });
          }
        });
      },
      handleUpdateYacht: async () => {
        await updateYacht
          .refetch()
          .then(async () => {
            removeFiles.every(async q => await q.refetch());
          })
          .then(async () => {
            const galleriesResolved =
              uploadFiles.every(async q => await q.isSuccess) &&
              removeFiles.every(async q => await q.isSuccess);
            await sleep(2000);
            if (galleriesResolved)
              await dispatch({ type: TYPES.CLEAR_TEMP_GALLERIES });
          })
          .then(async () => {
            await sleep(500);
            await galleryQuery.remove();
            await galleryQuery.refetch();
          });
      },
      addToGalleryToBeAdded: files =>
        dispatch({ type: TYPES.ADD_TO_GALLERY_TO_BE_ADDED, files }),
      removeFromGalleryToBeAdded: key =>
        dispatch({ type: TYPES.REMOVE_FROM_GALLERY_TO_BE_ADDED, key }),
      addToGalleryToBeRemoved: id =>
        dispatch({ type: TYPES.ADD_TO_GALLERY_TO_BE_REMOVED, id }),
      removeFromGalleryToBeRemoved: id =>
        dispatch({ type: TYPES.REMOVE_FROM_GALLERY_TO_BE_REMOVED, id })
    }
  ];
};
