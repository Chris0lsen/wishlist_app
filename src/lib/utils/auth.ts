import { useAuthStore } from '../stores/auth-store';

export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.access_token;

      // Update auth state using the login action
      useAuthStore.getState().login(newAccessToken);

      return true;
    }
    return false;
  } catch (error) {
    alert(error);

    return false;
  }
};

export const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    alert(error);
  }

  // Clear auth state using the logout action
  useAuthStore.getState().logout();

  // Redirect to login page or home
  window.location.href = '/';
};
