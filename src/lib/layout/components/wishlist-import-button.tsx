import { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { get } from '~/lib/utils/api';
import { useAuthStore } from '~/lib/stores/auth-store';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      onOpen(); // Open the modal after the data is fetched
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
      onOpen(); // Open the modal even if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        colorScheme="blue"
        disabled={disabled}
        onClick={handleShowImportModal}
      >
        Import Wishlist
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Wishlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
