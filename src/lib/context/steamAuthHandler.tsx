import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const SteamAuthHandler = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamId = params.get('steam_id');
    const error = params.get('error');

    if (steamId) {
      dispatch({ type: 'SET_STEAM_ID', payload: steamId });
      navigate('/');
    } else if (error) {
      console.error('Authentication error:', error);
      navigate('/');
    } else {
      console.error('No steam_id or error in query parameters.');
      navigate('/');
    }
  }, [navigate, dispatch]);

  return <div>Authenticating with Steam...</div>;
};

export default SteamAuthHandler;
