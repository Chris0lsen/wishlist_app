import { Flex, Input, Select, Spacer } from '@chakra-ui/react';

import { ThemeToggle } from './theme-toggle';
import { useEffect, useState } from 'react';
import { WishlistImportButton } from './wishlist-import-button';
import { useAuth } from '~/lib/context/use-auth';

interface Game {
  id: number;
  tiny_image: string;
  name: string;
  price: {
    final: number;
  } | null;
}

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Array<Game>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { state } = useAuth();

  // Debounce search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchGames(searchTerm);
      } else {
        setGames([]);
      }
    }, 500); // Adjust the debounce delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchGames = async (term: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://192.168.68.90:4000/api/search?term=${encodeURIComponent(term)}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGames(data.items);
    } catch (_) {
      setError('Failed to fetch games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" w="full">
      <Flex
        as="header"
        width="full"
        align="center"
        alignSelf="flex-start"
        justifyContent="center"
        gridGap={2}
      >
        <Spacer />
        <Flex direction="row" width="80%">
          <Input
            w="67%"
            placeholder="Search for a game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <WishlistImportButton disabled={!state.steamId} />
        </Flex>
        <Flex marginLeft="auto">
          <Select>
            <option>EN</option>
          </Select>
          <ThemeToggle />
        </Flex>
      </Flex>
      <Flex>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <img src={game.tiny_image} alt={game.name} />
              <p>{game.name}</p>
              <p>
                Price:{' '}
                {game.price
                  ? `$${(game.price.final / 100).toFixed(2)}`
                  : 'Free'}
              </p>
            </li>
          ))}
        </ul>
      </Flex>
    </Flex>
  );
};
