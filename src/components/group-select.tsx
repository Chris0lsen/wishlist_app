import { createListCollection } from '@chakra-ui/react';
import { useState } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from '~/components/ui/select';
import type {
  CollectionGroup,
  CollectionWishlist,
  Group,
  GroupSelectProps,
  Wishlist,
} from '../lib/types/types';

import {
  Button,
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useAuthStore } from '~/lib/stores/auth-store';
import { get } from '~/lib/utils/api';

interface WishlistItem {
  id: number;
  name: string;
  steam_id: string;
}

interface WishlistData {
  [key: string]: WishlistItem;
}

export const GroupSelect = ({ groups }: GroupSelectProps) => {
  const [selectedWishlistId, setSelectedWishlistId] = useState<Array<string>>([
    '',
  ]);

  const [open, setOpen] = useState(false);
  const [wishlistData, setWishlistData] = useState<WishlistData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

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

  const handleShowGamesModal = async (wishlistId: Array<string>) => {
    if (!(isAuthenticated && user)) {
      setError('User is not authenticated.');
      return;
    }

    const steamId = user.steamId;
    if (!steamId) {
      setError('Steam ID is not available.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedWishlistId(wishlistId);

    try {
      const games = await get<{ data: WishlistData }>(
        `/wishlists/${wishlistId}/games`,
      );
      setWishlistData(games.data);
      setOpen(true); // Open the modal after the data is fetched
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
      setOpen(true); // Open the modal even if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SelectRoot
        width="33%"
        collection={collection}
        size="xs"
        value={selectedWishlistId}
        onValueChange={(e) => handleShowGamesModal(e.value)}
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

      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size="xl"
      >
        <DialogContent>
          <DialogHeader>
            {/* Name of selected wishlist */}
            <DialogTitle>Import Wishlist</DialogTitle>
          </DialogHeader>

          <DialogCloseTrigger />
          <DialogBody>
            {isLoading ? (
              <Spinner size="lg" />
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <div>
                {Object.keys(wishlistData).length > 0 ? (
                  <ul>
                    {Object.entries(wishlistData).map(
                      ([itemId, itemDetails]) => (
                        <li key={itemId}>
                          <Text fontWeight="bold">{itemDetails.name}</Text>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <Text>No wishlist items found.</Text>
                )}
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger>
              <Button colorScheme="blue" mr={3} onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
