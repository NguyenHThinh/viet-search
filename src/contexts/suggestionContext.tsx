"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  ReactNode,
  ReactElement,
} from "react";
// import { getSuggestionsWhat, getSuggestionsWhere } from "../../services/experts";
import _ from "lodash";
import { getSuggestionWhat, getSuggestionWhere } from "@/services/search";
import { SUGGESTIONS_KEY, WHERE_SUGGESTIONS_KEY } from "@/constants/business";

const storage = globalThis.localStorage;

export interface Suggestion {
  slug: string;
  names: {
    [key: string]: string;
  };
  value: string;
  type: string;
  name: string;
  address: {
    displayed: string;
    country_names: {
      [key: string]: string;
    };
  };
  thumbnail: string;
}

export interface WhereSuggestion {
  id: string;
  names: {
    [key: string]: string;
  };
  value: string;
  type: string;
  name: string;
}

interface State {
  recentSuggestions: {
    suggestions: (string | Suggestion)[];
    whereSuggestions: string[];
  };
  suggestions: Suggestion[];
  whereSuggestions: WhereSuggestion[];
  whereLocation: string;
}

interface Action {
  type: ActionType;
  payload?: any;
}

const restoreSuggestions = (where?: boolean): string[] | null => {
  try {
    const restored = where
      ? storage.getItem(WHERE_SUGGESTIONS_KEY)
      : storage.getItem(SUGGESTIONS_KEY);
    if (restored) {
      return JSON.parse(restored);
    } else {
      return [];
    }
  } catch (err) {
    return null;
  }
};

const deleteRecentSuggestions = (
  value: string | Suggestion,
  where?: boolean,
): void => {
  const suggestionData = where
    ? storage.getItem(WHERE_SUGGESTIONS_KEY)
    : storage.getItem(SUGGESTIONS_KEY);
  let recentData = [];
  if (suggestionData) {
    recentData = JSON.parse(suggestionData);
  }

  recentData = recentData.filter((item: string | Suggestion) => {
    if (typeof item === "object" && typeof value === "object") {
      return item?.slug !== value?.slug;
    }
    return item !== value;
  });
  where
    ? storage.setItem(WHERE_SUGGESTIONS_KEY, JSON.stringify(recentData))
    : storage.setItem(SUGGESTIONS_KEY, JSON.stringify(recentData));
};

const storeSuggestions = (
  value: string | Suggestion,
  where?: boolean,
): void => {
  const key = where ? WHERE_SUGGESTIONS_KEY : SUGGESTIONS_KEY;
  const suggestionData = storage.getItem(key);
  let recentData = [];
  if (suggestionData) {
    recentData = JSON.parse(suggestionData);
  }

  recentData = recentData.filter((item: string | Suggestion) => {
    if (typeof item === "object" && typeof value === "object") {
      return item?.slug !== value?.slug; // clear duplicate item object
    }
    return item !== value; // clear duplicate item string
  });

  // Add new recent value on top
  recentData = [value, ...recentData];

  storage.setItem(key, JSON.stringify(recentData));
};

const initialState: State = {
  recentSuggestions: {
    suggestions: [],
    whereSuggestions: [],
  },
  suggestions: [],
  whereSuggestions: [],
  whereLocation: "",
};

enum ActionType {
  INITIALIZE = "INITIALIZE",
  SUGGESTIONS = "SUGGESTIONS",
  STORE_RECENT_SEARCH = "STORE_RECENT_SEARCH",
  DELETE_RECENT_SEARCH = "DELETE_RECENT_SEARCH",
  WHERE_SUGGESTIONS = "WHERE_SUGGESTIONS",
}

const handlers: Record<string, (state: State, action: Action) => State> = {
  [ActionType.INITIALIZE]: (state: State, action: Action): State => {
    const { recentSuggestions, recentWhereSuggestions } = action.payload;

    return {
      ...state,
      recentSuggestions: {
        ...state.recentSuggestions,
        suggestions: recentSuggestions,
        whereSuggestions: recentWhereSuggestions,
      },
    };
  },

  [ActionType.SUGGESTIONS]: (state: State, action: Action): State => {
    const { suggestions } = action.payload;

    return {
      ...state,
      suggestions,
    };
  },

  [ActionType.WHERE_SUGGESTIONS]: (state: State, action: Action): State => {
    const { whereSuggestions, whereLocation } = action.payload;

    return {
      ...state,
      whereSuggestions,
      whereLocation,
    };
  },

  [ActionType.STORE_RECENT_SEARCH]: (state: State, action: Action): State => {
    const { value, where } = action.payload;

    if (where) {
      return {
        ...state,
        recentSuggestions: {
          ...state.recentSuggestions,
          whereSuggestions: [
            value,
            ..._.without(state.recentSuggestions.whereSuggestions || [], value),
          ],
        },
      };
    }

    // only suggestion what can be object
    const isDuplicate =
      typeof value === "object"
        ? state.recentSuggestions.suggestions.some(
            (item) => typeof item === "object" && item?.slug === value?.slug,
          )
        : state.recentSuggestions.suggestions.includes(value);

    if (isDuplicate) return state;

    return {
      ...state,
      recentSuggestions: {
        ...state.recentSuggestions,
        suggestions: [
          value,
          ..._.without(state.recentSuggestions.suggestions || [], value),
        ],
      },
    };
  },

  [ActionType.DELETE_RECENT_SEARCH]: (state: State, action: Action): State => {
    const { value, where } = action.payload;

    if (where) {
      return {
        ...state,
        recentSuggestions: {
          ...state.recentSuggestions,
          whereSuggestions: _.without(
            state.recentSuggestions.whereSuggestions,
            value,
          ),
        },
      };
    }

    return {
      ...state,
      recentSuggestions: {
        ...state.recentSuggestions,
        suggestions: state.recentSuggestions.suggestions.filter((item) => {
          //case type object
          if (typeof item === "object" && typeof value === "object") {
            return item?.slug !== value?.slug;
          }
          // case type string
          return item !== value;
        }),
      },
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface SuggestionsContextProps {
  recentSuggestions: {
    suggestions: (string | Suggestion)[];
    whereSuggestions: string[];
  };
  suggestions: Suggestion[];
  whereSuggestions: WhereSuggestion[];
  handleSuggestionsWhat: (query: string) => Promise<void>;
  handleSuggestionsWhere: (query: string) => Promise<void>;
  handleStoreSuggestions: (query: string | Suggestion, where?: boolean) => void;
  handleDeleteRecentSuggestions: (
    query: string | Suggestion,
    where?: boolean,
  ) => void;
}

export const SuggestionsContext = createContext<SuggestionsContextProps>({
  recentSuggestions: { suggestions: [], whereSuggestions: [] },
  suggestions: [],
  whereSuggestions: [],
  handleSuggestionsWhat: () => Promise.resolve(),
  handleSuggestionsWhere: () => Promise.resolve(),
  handleStoreSuggestions: () => Promise.resolve(),
  handleDeleteRecentSuggestions: () => Promise.resolve(),
});

interface SuggestionsProviderProps {
  children: ReactNode;
  lang: string;
}

export const SuggestionsProvider = ({
  children,
  lang,
}: SuggestionsProviderProps): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    try {
      const recentSuggestionsData = restoreSuggestions();
      const recentWhereSuggestionsData = restoreSuggestions(true);

      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          recentSuggestions: recentSuggestionsData ?? [],
          recentWhereSuggestions: recentWhereSuggestionsData ?? [],
        },
      });
    } catch (e) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          recentSuggestions: [],
          recentWhereSuggestions: [],
        },
      });
    }
  }, [dispatch]);

  const handleSuggestionsWhat = useCallback(
    async (query: string) => {
      try {
        const searchParams = {
          q: query,
          size: 10,
          lang,
          where: state.whereLocation,
        };
        const items = await getSuggestionWhat(searchParams);
        dispatch({
          type: ActionType.SUGGESTIONS,
          payload: {
            suggestions: items ?? [],
          },
        });
      } catch (e) {
        console.error("Has wrong with fetch suggetions: ", e);
      }
    },
    [state.whereLocation, lang],
  );

  const handleSuggestionsWhere = useCallback(
    async (query: string) => {
      try {
        const searchParams = { q: query, size: 10, lang };
        const items = await getSuggestionWhere(searchParams);
        dispatch({
          type: ActionType.WHERE_SUGGESTIONS,
          payload: {
            whereSuggestions: items ?? [],
            whereLocation: query,
          },
        });
      } catch (e) {
        console.error("Has wrong with fetch suggetions: ", e);
      }
    },
    [dispatch],
  );

  const handleStoreSuggestions = useCallback(
    (query: string | Suggestion, where?: boolean) => {
      where ? storeSuggestions(query, true) : storeSuggestions(query);

      try {
        dispatch({
          type: ActionType.STORE_RECENT_SEARCH,
          payload: {
            value: query ?? "",
            where,
          },
        });
      } catch (e) {
        console.error("Has wrong with fetch suggetions: ", e);
      }
    },
    [dispatch],
  );

  const handleDeleteRecentSuggestions = useCallback(
    (query: string | Suggestion, where?: boolean) => {
      where
        ? deleteRecentSuggestions(query, true)
        : deleteRecentSuggestions(query);
      try {
        dispatch({
          type: ActionType.DELETE_RECENT_SEARCH,
          payload: {
            value: query ?? "",
            where,
          },
        });
      } catch (e) {
        console.error("Has wrong with fetch suggetions: ", e);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <SuggestionsContext.Provider
      value={{
        ...state,
        handleSuggestionsWhat,
        handleSuggestionsWhere,
        handleStoreSuggestions,
        handleDeleteRecentSuggestions,
      }}
    >
      {children}
    </SuggestionsContext.Provider>
  );
};
