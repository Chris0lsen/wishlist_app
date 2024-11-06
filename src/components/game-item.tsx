// header.tsx

import {
  Button,
  Group as ButtonGroup,
  Flex,
  createListCollection,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from '~/components/ui/select';
import { toaster } from '~/components/ui/toaster';
import { useAuthStore } from '~/lib/stores/auth-store';
import type {
  CollectionGroup,
  CollectionWishlist,
  GameItemProps,
  Group,
  Wishlist,
} from '~/lib/types/types';
import { post } from '~/lib/utils/api';

export const GameItem = ({
  game,
  groups,
  refetchWishlistsAndGroups,
}: GameItemProps) => {
  const [selectedWishlistId, setSelectedWishlistId] = useState<Array<string>>([
    '',
  ]);
  const { user } = useAuthStore();

  // Create collection for Select component
  const collectionItems: Array<CollectionGroup> = groups?.map(
    (group: Group) => ({
      type: 'group',
      label: group.name,
      value: group.id.toString(),
      items: group.wishlists.map((wishlist: Wishlist) => ({
        label: wishlist.name,
        value: wishlist.id.toString(),
      })),
    }),
  );

  const collection = createListCollection({
    items: collectionItems,
  });

  const handleAddToWishlist = async () => {
    if (selectedWishlistId && user) {
      try {
        await post<{ message: string }, { gameId: number }>(
          `/wishlists/${selectedWishlistId}/games`,
          { gameId: game.id },
        );
        refetchWishlistsAndGroups();
        // Optionally, provide feedback to the user
      } catch (error) {
        toaster.create({
          description: `Error fetching wishlists and groups:, ${error}`,
          type: 'error',
        });
      }
    } else {
      alert('Please select a wishlist first');
    }
  };

  return (
    <Flex
      key={game.id}
      direction="row"
      align="center"
      mb={2}
      p={2}
      borderWidth="1px"
      borderRadius="md"
    >
      <img
        src={game.tiny_image}
        alt={game.name}
        width="231"
        height="87"
        style={{ marginRight: '16px' }}
      />
      <Flex direction="column" flex="1">
        <p>{game.name}</p>
        <p>
          Price:{' '}
          {game.price ? `$${(game.price.final / 100).toFixed(2)}` : 'Free'}
        </p>
      </Flex>
      <Flex align="center">
        <ButtonGroup attached>
          <Button onClick={handleAddToWishlist}>+</Button>
          <SelectRoot
            collection={collection}
            value={selectedWishlistId}
            onValueChange={(e) => setSelectedWishlistId(e.value)}
            multiple={false}
          >
            <SelectTrigger>
              <SelectLabel>Select Wishlist</SelectLabel>
            </SelectTrigger>
            <SelectContent>
              {collection.items.map((group: CollectionGroup) => (
                <SelectItemGroup key={group.value} label={group.label}>
                  {group.items.map((wishlist: CollectionWishlist) => (
                    <SelectItem key={wishlist.value} item={wishlist}>
                      {wishlist.label}
                    </SelectItem>
                  ))}
                </SelectItemGroup>
              ))}
            </SelectContent>
          </SelectRoot>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};
