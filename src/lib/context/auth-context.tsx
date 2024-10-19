import {
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import { authReducer, initialState } from './auth-reducer';
import type { State, Action } from '../types/types';

interface AuthContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
