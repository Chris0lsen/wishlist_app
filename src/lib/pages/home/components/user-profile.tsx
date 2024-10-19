import { useAuth } from '~/lib/context/use-auth';

const UserProfile: React.FC = () => {
  const { state, dispatch } = useAuth();
  const { steamId } = state;

  return (
    <div>
      {steamId ? (
        <div>
          <p>Logged in as Steam user: {steamId}</p>
          <button type="button" onClick={() => dispatch({ type: 'LOGOUT' })}>
            Logout
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default UserProfile;
