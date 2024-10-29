import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';

export const SteamAuthHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Use the login action from the auth store
      login(accessToken);

      // Navigate to the home page or desired route
      navigate('/');
    } else {
      // Handle authentication error
      navigate('/login');
    }
  }, [location, navigate, login]);

  return <div>Authenticating with Steam...</div>;
};
