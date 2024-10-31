import { Flex, Input, Spacer, createListCollection } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from '~/components/ui/select';
import { useAuthStore } from '~/lib/stores/auth-store';
import { WishlistImportButton } from './wishlist-import-button';

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
  const [selectedLanguage, setSelectedLanguage] = useState<Array<string>>([]);
  const [games, setGames] = useState<Array<Game>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuthStore();

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
        `http://localhost:4000/api/steam/search?term=${encodeURIComponent(term)}`,
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

  const languages = createListCollection({
    items: [
      { label: 'EN', value: 'en' },
      { label: 'ES', value: 'es' },
    ],
  });

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
            width="67%"
            placeholder="Search for a game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <WishlistImportButton disabled={!user?.steamId} />
        </Flex>
        <Flex marginLeft="auto">
          <SelectRoot
            collection={languages}
            size="xs"
            value={selectedLanguage}
            onValueChange={(e) => setSelectedLanguage(e.value)}
          >
            <SelectTrigger>
              <SelectLabel>Language</SelectLabel>
            </SelectTrigger>
            <SelectContent>
              {languages.items.map((language) => (
                <SelectItem item={language} key={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
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
