import { useAuthStore } from '~/lib/stores/auth-store';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div>
      {user?.steamId ? (
        <div>
          <p>Logged in as Steam user: {user.steamId}</p>
          <button type="button" onClick={logout}>
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
