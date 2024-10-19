import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const UserProfile = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { steamId } = state;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div>
      {steamId ? (
        <div>
          <p>Logged in as Steam user: {steamId}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default UserProfile;
