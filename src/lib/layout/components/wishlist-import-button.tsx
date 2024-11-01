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
  DialogTrigger,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineImport } from 'react-icons/ai';
import { useAuthStore } from '~/lib/stores/auth-store';
import { get } from '~/lib/utils/api';

interface WishlistItem {
  name: string;
  price: number;
}

interface WishlistData {
  [key: string]: WishlistItem;
}

interface WishlistImportButtonProps {
  disabled: boolean;
}

export const WishlistImportButton: React.FC<WishlistImportButtonProps> = ({
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [wishlistData, setWishlistData] = useState<WishlistData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const handleShowImportModal = async () => {
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

    try {
      const data = await get<WishlistData>(
        `/wishlist?steam_id=${steamId}&cc=en`,
      );
      setWishlistData(data);
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
      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size="xl"
      >
        <DialogTrigger>
          <Button
            colorScheme="blue"
            disabled={disabled}
            onClick={handleShowImportModal}
          >
            <AiOutlineImport /> Import Wishlist
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
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
