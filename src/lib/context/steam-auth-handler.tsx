import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './use-auth';
import { useToast } from '@chakra-ui/react';

export const SteamAuthHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuth();
  const toast = useToast(); // Get the toast function from Chakra UI

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const steamId = params.get('steam_id');
    const error = params.get('error');

    if (steamId) {
      dispatch({ type: 'SET_STEAM_ID', payload: steamId });
      navigate('/');
    } else if (error) {
      toast({
        title: 'Authentication Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      navigate('/');
    } else {
      toast({
        title: 'Error',
        description: 'No steam_id or error in query parameters.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      navigate('/');
    }
  }, [navigate, location, dispatch, toast]);

  return <div>Authenticating with Steam...</div>;
};
