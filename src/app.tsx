import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '~/components/ui/toaster';

import { defaultSystem } from '@chakra-ui/react';
import { Layout } from '~/lib/layout';
import { Routings } from '~/lib/router/routings';

const queryClient = new QueryClient();

export const App = () => (
  <ChakraProvider value={defaultSystem}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routings />
        </Layout>
      </Router>
      <Toaster />
    </QueryClientProvider>
  </ChakraProvider>
);
