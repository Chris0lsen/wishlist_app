import type {
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';

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

export interface Wishlist {
  id: number;
  name: string;
  group_id: number;
}

export interface Group {
  id: number;
  name: string;
  wishlists: Array<Wishlist>;
}

export interface Game {
  id: number;
  tiny_image: string;
  name: string;
  price: {
    final: number;
  } | null;
}

export interface GameItemProps {
  game: Game;
  groups: Array<Group>;
  refetchWishlistsAndGroups: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<Array<Group>, Error>>;
}

export interface CollectionWishlist {
  label: string;
  value: string;
}

export interface CollectionGroup {
  type: 'group';
  label: string;
  value: string;
  items: Array<CollectionWishlist>;
}

export type Action =
  | { type: 'SET_AUTH_STATE'; payload: AuthStatePayload }
  | { type: 'LOGOUT' };
