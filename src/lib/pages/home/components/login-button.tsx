const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'http://192.168.68.90:4000/api/auth/steam';
  };

  return (
    <button type="button" onClick={handleLogin}>
      Login with Steam
    </button>
  );
};

export default LoginButton;
