import { Flex, Input } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { GameItem } from '~/components/game-item';
import { toaster } from '~/components/ui/toaster';
import { useAuthStore } from '~/lib/stores/auth-store';
import type { Game, Group, User } from '~/lib/types/types';
import { get } from '~/lib/utils/api';
import { GroupSelect } from './group-select';
import { WishlistImportButton } from './wishlist-import-button';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchGames = async (term: string) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await get<{ items: Array<Game> }>(
        `/steam/search?term=${encodeURIComponent(term)}`,
      );
      setGames(data.items);
    } catch (_error) {
      setError('Error searching for games');
    } finally {
      setIsLoading(false);
    }
  };

  const {
    data: userData,
    refetch,
    error: fetchError,
  } = useQuery({
    queryKey: ['wishlistsAndGroups', user?.userId],
    queryFn: () => fetchWishlistsAndGroups(user),

    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (error) {
      toaster.create({
        description: `Error searching for games: ${error}`,
        type: 'error',
      });
    }
    if (fetchError) {
      toaster.create({
        description: `Error fetching wishlists: ${error}`,
        type: 'error',
      });
    }
  }, [error, fetchError]);

  const fetchWishlistsAndGroups = async (user: User | null) => {
    return await get<{ data: Array<Group> }>(`/users/${user?.userId}/groups`);
  };

  return (
    <Flex direction="column" width="80%" mx="auto" mt={4}>
      <Flex direction="row" align="center" mb={4}>
        <Input
          width="60%"
          placeholder="Search for a game..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <GroupSelect
          groups={userData?.data || []}
          refetchWishlistsAndGroups={refetch}
        />
        <WishlistImportButton disabled={!user?.steamId} />
      </Flex>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <Flex direction="column">
        {games.map((game) => (
          <GameItem
            key={game.id}
            game={game}
            groups={userData?.data || []}
            refetchWishlistsAndGroups={refetch}
          />
        ))}
      </Flex>
    </Flex>
  );
};
