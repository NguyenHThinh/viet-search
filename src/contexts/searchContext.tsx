"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { IBusiness } from "@/models/iBusiness";
import { useRouter, useSearchParams } from "next/navigation";
import { iFacets } from "@/models/iFacets";
import _ from "lodash";
import { PATH_PAGE } from "@/contains/paths";
import { searchBusiness } from "@/services/business";

interface State {
  result: IBusiness[];
  total: {
    [key: string]: string | number;
  };
  facets: iFacets;
  searchParams: {
    [key: string]: string;
  };
}

enum ActionType {
  INITIALIZE = "INITIALIZE",
  SET_RESULT = "SET_RESULT",
  SET_FILTER = "SET_FILTER",
  CLEAR_SEARCH_PARAMS = "CLEAR_SEARCH_PARAMS",
}

interface Action {
  type: ActionType;
  payload?: any;
}

export const initialState: State = {
  result: [],
  total: {},
  facets: {
    countries: [],
    categories: [],
    types: [],
  },
  searchParams: {
    q: "",
    where: "",
    star: "",
    size: "30",
    start: "0",
    types: "",
    status: "verified",
    countries: "",
    categories: "",
    top_left: "",
    bottom_right: "",
    lang: "",
    facets: "categories:12,countries:12,types:5",
  },
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  [ActionType.INITIALIZE]: (state: State, action: Action): State => {
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        ...action.payload,
      },
    };
  },

  [ActionType.SET_RESULT]: (state: State, action: Action): State => {
    const resuft = action.payload;

    return {
      ...state,
      result: resuft?.items ?? [],
      facets: resuft?.facets ?? {},
      total: resuft?.total ?? {},
    };
  },

  [ActionType.SET_FILTER]: (state: State, action: Action): State => {
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        start: 0,
        ...action.payload,
      },
    };
  },

  [ActionType.CLEAR_SEARCH_PARAMS]: (state: State, action: Action): State => {
    return {
      ...state,
      searchParams: initialState.searchParams,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface BusinessContextProps {
  result: IBusiness[];
  facets: iFacets;
  total: {
    [key: string]: string | number;
  };
  searchParams: {
    [key: string]: string;
  };
  getSearchParams: () => void;
  clearSearchParams: () => void;
  setFilter: (newFilter: { [key: string]: string }) => void;
  isLoading: boolean;
  error: any;
}

export const BusinessContext = createContext<BusinessContextProps>({
  result: [],
  total: {},
  facets: {
    countries: [],
    categories: [],
    types: [],
  },
  searchParams: {},
  isLoading: false,
  getSearchParams: () => {},
  clearSearchParams: () => {},
  setFilter: () => {},
  error: "",
});

export function BusinessProvider({
  children,
  lng,
}: {
  children: React.ReactElement;
  lng: string;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchParamsKeys = useSearchParams();

  // loading state
  const [searching, setSearching] = useState(false);

  // get search result
  const fetchBusinesses = async (searchParams: { [key: string]: string }) => {
    updateUrlWithParams(searchParams);
    const { q, ...rest } = searchParams;
    const updatedSearchParams = { ...rest, what: q };
    setSearching(true);

    const data = await searchBusiness(_.omitBy(updatedSearchParams, _.isEmpty));
    setSearching(false);
    return data;
  };

  // call search resulf
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ["business"],
    queryFn: () => fetchBusinesses(state.searchParams),
    enabled: false,
  });

  // set result data
  useEffect(() => {
    if (data) {
      dispatch({ type: ActionType.SET_RESULT, payload: data });
    }
  }, [data]);

  const getSearchParams = useCallback(async () => {
    const params = new URLSearchParams(searchParamsKeys.toString());
    const searchParams = { ...initialState.searchParams };

    params.forEach((value, key) => {
      if (key in searchParams) {
        searchParams[key] = value;
      }
    });

    await dispatch({
      type: ActionType.INITIALIZE,
      payload: { ...searchParams, lang: lng },
    });
    refetch();
  }, [refetch, searchParamsKeys]);

  const setFilter = async (newFilter: { [key: string]: string }) => {
    try {
      await dispatch({
        type: ActionType.SET_FILTER,
        payload: { ...newFilter, lang: lng },
      });
      updateUrlWithParams({ ...state.searchParams, ...newFilter, lang: lng });
    } catch (e) {
      console.error("Has wrong with set filter: ", e);
    }
  };

  // handle clear all filter
  const clearSearchParams = useCallback(() => {
    dispatch({ type: ActionType.CLEAR_SEARCH_PARAMS });
  }, []);

  // handle update url
  const updateUrlWithParams = useCallback(
    (newFilter: { [key: string]: string }) => {
      const filteredSearchParams = _.pickBy(
        { ...newFilter },
        (value) => value !== null && value !== undefined && value !== "",
      );
      const params = new URLSearchParams({
        ..._.omit(filteredSearchParams, ["lang", "size", "facets", "status"]),
      }).toString();
      router.push(`/${lng + PATH_PAGE.searchBusiness}?${params}`, {
        scroll: false,
      });
    },
    [lng, router],
  );

  return (
    <BusinessContext.Provider
      value={{
        ...state,
        getSearchParams,
        clearSearchParams,
        setFilter,
        isLoading: searching,
        error,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}
