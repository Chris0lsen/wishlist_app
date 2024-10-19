import React from 'react';
import type { PathRouteProps } from 'react-router-dom';
import { SteamAuthHandler } from '../context/steam-auth-handler';

const Home = React.lazy(() => import('~/lib/pages/home'));

export const routes: Array<PathRouteProps> = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/steam/callback',
    element: <SteamAuthHandler />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [];
