import type { State, Action } from '../types/types';

export const initialState = {
  steamId: null,
  user: null,
};

export const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_STEAM_ID':
      return {
        ...state,
        steamId: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};
