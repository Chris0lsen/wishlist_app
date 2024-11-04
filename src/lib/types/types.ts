export interface State {
  authState: AuthState;
}

export interface User {
  userId: number | null;
  steamId: number | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
}

export interface DecodedPayload {
  steam_id: number | null;
  user_id: number | null;
}

export interface Decoded {
  userId: number | null;
  steamId: number | null;
}

export interface AuthStatePayload {
  user: Decoded;
  isAuthenticated: boolean;
  accessToken: string;
}

export interface GroupItem {
  name: string;
}

export interface GroupData {
  [key: string]: GroupItem;
}

export interface GroupSelectProps {
  disabled: boolean;
}

export interface WishlistItem {
  name: string;
  price: number;
}

export interface WishlistData {
  [key: string]: WishlistItem;
}

export interface WishlistImportButtonProps {
  disabled: boolean;
}

export type Action =
  | { type: 'SET_AUTH_STATE'; payload: AuthStatePayload }
  | { type: 'LOGOUT' };
