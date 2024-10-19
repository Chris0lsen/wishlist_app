import { Grid } from '@chakra-ui/react';

import LoginButton from './components/login-button';
import UserProfile from './components/user-profile';

const Home = () => {
  return (
    <Grid gap={4}>
      <UserProfile />
      <LoginButton />
    </Grid>
  );
};

export default Home;
