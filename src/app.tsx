import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Layout } from '~/lib/layout';
import { Routings } from '~/lib/router/routings';
import { theme } from '~/lib/styles/theme';
import { AuthProvider } from '~/lib/context/authContext';

export const App = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <Router>
        <Layout>
          <Routings />
        </Layout>
      </Router>
    </AuthProvider>
  </ChakraProvider>
);
