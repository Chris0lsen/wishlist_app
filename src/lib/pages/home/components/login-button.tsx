const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/api/auth/steam';
  };

  return (
    <button type="button" onClick={handleLogin}>
      Login with Steam
    </button>
  );
};

export default LoginButton;
