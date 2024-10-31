import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { defaultSystem } from '@chakra-ui/react';
import { Layout } from '~/lib/layout';
import { Routings } from '~/lib/router/routings';

export const App = () => (
  <ChakraProvider value={defaultSystem}>
    <Router>
      <Layout>
        <Routings />
      </Layout>
    </Router>
  </ChakraProvider>
);
