export interface User {
  personaname: string;
  avatarfull: string;
  // Add other properties as needed
}

export interface State {
  steamId: string | null;
  user: User | null;
}

export type Action =
  | { type: 'SET_STEAM_ID'; payload: string }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' };
