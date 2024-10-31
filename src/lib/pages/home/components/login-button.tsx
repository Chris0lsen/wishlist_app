const LoginButton = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/steam`;
  };

  return (
    <button type="button" onClick={handleLogin}>
      Login with Steam
    </button>
  );
};

export default LoginButton;
